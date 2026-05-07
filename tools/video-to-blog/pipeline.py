#!/usr/bin/env python3
"""
Video → Transcript → Blog pipeline.

Steps:
  1. Acquire audio (yt-dlp from URL, or ffmpeg from a local video file).
  2. Transcribe with faster-whisper → transcript.txt + transcript.srt.
  3. Hand the transcript to Claude Code (`claude -p`) → blog.md.
  4. (optional) Publish blog.md into a blog-repo (jianwang-ntu.github.io style).

Usage examples:
  python pipeline.py --url "https://www.youtube.com/watch?v=XXXXXXXXXXX"
  python pipeline.py --file /data/in/video.mp4 --language en --model small
  python pipeline.py --url "..." --blog-language "Simplified Chinese"
  python pipeline.py --from blog --blog-repo ./blog-repo   # redraft + publish
"""
from __future__ import annotations

import argparse
import datetime as _dt
import json
import logging
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

from faster_whisper import WhisperModel

log = logging.getLogger("pipeline")


# --------------------------------------------------------------------------- #
# Step 1 — acquire audio
# --------------------------------------------------------------------------- #
# Extractor args for yt-dlp's YouTube backend. Trying multiple `player_client`
# values gives us several chances to bypass the "Sign in to confirm you're not
# a bot" challenge without fresh cookies — different clients have different
# anti-bot policies. Order matters: yt-dlp uses the first that works.
_YTDLP_PLAYER_CLIENTS = "default,tv,mweb"


def download_audio(url: str, out_dir: Path, cookies: Path | None = None) -> Path:
    """Use yt-dlp to fetch best audio and convert to mp3. Returns mp3 path.

    `cookies` is an optional Netscape-format cookies file. Useful for sites
    (notably YouTube) that block headless/unrecognised IPs with an
    anti-bot challenge — pass authenticated cookies to bypass it.
    """
    log.info("Downloading audio from %s", url)
    out_template = str(out_dir / "source.%(ext)s")
    cmd = [
        "yt-dlp",
        "-x",                          # extract audio only
        "--audio-format", "mp3",
        "--audio-quality", "0",        # best
        "-o", out_template,
        "--no-playlist",
        "--quiet", "--progress",
        # YouTube's "n challenge" needs a JS runtime + the EJS solver
        # script. yt-dlp can fetch the solver from GitHub at runtime; without
        # this flag, format extraction fails on a JS-runtime-equipped runner
        # with "Requested format is not available".
        "--remote-components", "ejs:github",
        "--extractor-args", f"youtube:player_client={_YTDLP_PLAYER_CLIENTS}",
    ]
    if cookies is not None:
        cmd += ["--cookies", str(cookies)]
    cmd.append(url)
    subprocess.run(cmd, check=True)
    mp3 = out_dir / "source.mp3"
    if not mp3.exists():
        raise RuntimeError(f"yt-dlp finished but {mp3} is missing")
    # Stash the source URL so a later --from publish run can attribute it.
    (out_dir / "source.url").write_text(url + "\n", encoding="utf-8")
    return mp3


def extract_audio_from_file(video_path: Path, out_dir: Path) -> Path:
    """Use ffmpeg to extract a mono 16 kHz mp3 from a local video file."""
    log.info("Extracting audio from local file %s", video_path)
    mp3 = out_dir / "source.mp3"
    cmd = [
        "ffmpeg", "-y", "-i", str(video_path),
        "-vn", "-ac", "1", "-ar", "16000",
        "-c:a", "libmp3lame", "-b:a", "64k",
        str(mp3),
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return mp3


# --------------------------------------------------------------------------- #
# Step 1.5 — caption fast path (skip audio + whisper if captions exist)
# --------------------------------------------------------------------------- #
def _srt_to_plain_text(srt: str) -> str:
    """Strip SRT numbers, timestamps, inline tags. Dedupe consecutive repeats."""
    out: list[str] = []
    for raw in srt.splitlines():
        line = raw.strip()
        if not line or line.isdigit() or "-->" in line:
            continue
        line = re.sub(r"<[^>]+>", "", line).strip()
        if not line:
            continue
        if out and out[-1] == line:
            continue
        out.append(line)
    return "\n".join(out)


_YT_ID_RE = re.compile(
    r"(?:youtube\.com/(?:watch\?v=|embed/|v/)|youtu\.be/)([A-Za-z0-9_-]{11})"
)


def _extract_youtube_id(url: str) -> str | None:
    m = _YT_ID_RE.search(url)
    return m.group(1) if m else None


def _try_captions_via_yt_transcript_api(url: str, out_dir: Path, lang: str = "en") -> Path | None:
    """Use the youtube-transcript-api Python package to fetch captions through
    YouTube's /timedtext endpoint. This endpoint isn't behind the player-side
    bot challenge that breaks yt-dlp on cloud-runner IPs, so it's the most
    reliable path for YouTube. Returns transcript.txt path on success, None
    otherwise."""
    vid = _extract_youtube_id(url)
    if not vid:
        return None
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
        from youtube_transcript_api._errors import (
            TranscriptsDisabled, NoTranscriptFound, VideoUnavailable,
        )
    except ImportError:
        log.info("youtube-transcript-api not installed; skipping API caption path.")
        return None

    log.info("Fetching captions via youtube-transcript-api for %s", vid)
    base = lang.split("-")[0]
    candidates = [lang, base] if lang != base else [lang]

    # On cloud-runner IPs, YouTube blocks both the player API and /timedtext.
    # WebshareProxyConfig routes through residential IPs and is the
    # library-recommended workaround. Activated when both env vars are set.
    proxy_user = os.environ.get("WEBSHARE_PROXY_USERNAME")
    proxy_pass = os.environ.get("WEBSHARE_PROXY_PASSWORD")
    if proxy_user and proxy_pass:
        try:
            from youtube_transcript_api.proxies import WebshareProxyConfig
            api = YouTubeTranscriptApi(
                proxy_config=WebshareProxyConfig(
                    proxy_username=proxy_user,
                    proxy_password=proxy_pass,
                )
            )
            log.info("Using Webshare residential proxy for caption fetch.")
        except ImportError:
            log.info("youtube-transcript-api proxies module unavailable; using direct.")
            api = YouTubeTranscriptApi()
    else:
        api = YouTubeTranscriptApi()

    try:
        fetched = api.fetch(vid, languages=candidates)
        snippets = list(fetched)
    except (TranscriptsDisabled, NoTranscriptFound, VideoUnavailable) as e:
        log.info("youtube-transcript-api: %s — falling through.", type(e).__name__)
        return None
    except Exception as e:
        log.info("youtube-transcript-api error (%s); falling through.", e)
        return None

    if not snippets:
        return None

    text = "\n".join(s.text.strip() for s in snippets if s.text and s.text.strip())
    if not text.strip():
        return None

    srt_lines: list[str] = []
    for i, s in enumerate(snippets, 1):
        start = s.start
        end = start + (s.duration or 0)
        srt_lines.append(
            f"{i}\n{_format_srt_timestamp(start)} --> {_format_srt_timestamp(end)}\n"
            f"{(s.text or '').strip()}\n"
        )
    txt_path = out_dir / "transcript.txt"
    srt_path = out_dir / "transcript.srt"
    txt_path.write_text(text + "\n", encoding="utf-8")
    srt_path.write_text("\n".join(srt_lines), encoding="utf-8")
    (out_dir / "source.url").write_text(url + "\n", encoding="utf-8")
    log.info("Captions (yt-transcript-api) → %s (%d bytes)", txt_path, txt_path.stat().st_size)
    return txt_path


def try_captions(url: str, out_dir: Path, cookies: Path | None = None,
                 lang: str = "en") -> Path | None:
    """Best-effort: get existing captions for `url`. Strategy:

    1. For YouTube URLs, try youtube-transcript-api first — it queries
       YouTube's /timedtext endpoint directly and isn't blocked the way
       yt-dlp's player-side flow is on cloud-runner IPs.
    2. Fall back to yt-dlp's --write-(auto-)subs for non-YouTube hosts
       and as a second chance on YouTube when the API path didn't work.

    Returns transcript.txt path on success, None otherwise. Lets the
    pipeline skip the audio download + Whisper transcription when an
    existing transcript can be retrieved — seconds instead of minutes."""
    if _extract_youtube_id(url):
        result = _try_captions_via_yt_transcript_api(url, out_dir, lang)
        if result is not None:
            return result

    log.info("Looking for captions via yt-dlp on %s", url)
    cmd = [
        "yt-dlp",
        "--skip-download",
        "--write-subs",            # manually-uploaded subs first
        "--write-auto-subs",       # YouTube auto-captions fallback
        "--sub-langs", f"{lang}.*,{lang}",
        "--sub-format", "vtt",
        "--convert-subs", "srt",   # normalise rolling auto-cap format
        "-o", str(out_dir / "captions.%(ext)s"),
        "--quiet",
        "--remote-components", "ejs:github",
        "--extractor-args", f"youtube:player_client={_YTDLP_PLAYER_CLIENTS}",
    ]
    if cookies is not None:
        cmd += ["--cookies", str(cookies)]
    cmd.append(url)
    try:
        subprocess.run(cmd, check=True, timeout=120)
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired) as e:
        log.warning("Caption fetch failed (%s); will try the audio + whisper path.",
                    type(e).__name__)
        return None

    srts = sorted(out_dir.glob("captions*.srt"))
    if not srts:
        log.info("No captions available for this video.")
        return None

    text = _srt_to_plain_text(srts[0].read_text(encoding="utf-8"))
    if not text.strip():
        log.info("Caption file was empty after stripping.")
        return None

    txt_path = out_dir / "transcript.txt"
    srt_path = out_dir / "transcript.srt"
    txt_path.write_text(text + "\n", encoding="utf-8")
    srt_path.write_text(srts[0].read_text(encoding="utf-8"), encoding="utf-8")
    # Stash the source URL so a later --from publish run can attribute it.
    (out_dir / "source.url").write_text(url + "\n", encoding="utf-8")
    log.info("Captions saved → %s (%d bytes)", txt_path, txt_path.stat().st_size)
    return txt_path


# --------------------------------------------------------------------------- #
# Step 2 — transcribe
# --------------------------------------------------------------------------- #
def _format_srt_timestamp(seconds: float) -> str:
    ms = int(round(seconds * 1000))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def _split_audio_for_api(audio: Path, out_dir: Path, max_bytes: int = 24 * 1024 * 1024,
                         chunk_seconds: int = 600) -> list[tuple[Path, float]]:
    """Split `audio` into chunks under `max_bytes` for the OpenAI Whisper API
    (25MB hard limit). Returns [(chunk_path, start_seconds), ...] in order.
    No-op (returns [(audio, 0.0)]) when the file is already small enough."""
    if audio.stat().st_size <= max_bytes:
        return [(audio, 0.0)]
    chunks_dir = out_dir / "chunks"
    if chunks_dir.exists():
        shutil.rmtree(chunks_dir)
    chunks_dir.mkdir()
    log.info("Audio is %.1f MB — splitting into ~%d-second chunks for the API.",
             audio.stat().st_size / 1e6, chunk_seconds)
    cmd = [
        "ffmpeg", "-y", "-i", str(audio),
        "-f", "segment", "-segment_time", str(chunk_seconds),
        "-ar", "16000", "-ac", "1",
        "-c:a", "libmp3lame", "-b:a", "32k",
        str(chunks_dir / "chunk-%03d.mp3"),
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    paths = sorted(chunks_dir.glob("chunk-*.mp3"))
    return [(p, i * chunk_seconds) for i, p in enumerate(paths)]


def transcribe_with_openai(audio: Path, out_dir: Path, language: str | None) -> Path:
    """Transcribe `audio` via OpenAI's Whisper API. Handles >25MB files by
    chunking at ~10-minute boundaries and concatenating the per-chunk SRTs
    (offsetting timestamps). Returns transcript.txt path."""
    if not os.environ.get("OPENAI_API_KEY"):
        raise RuntimeError("OPENAI_API_KEY is not set in the environment.")
    try:
        from openai import OpenAI
    except ImportError as e:
        raise RuntimeError(
            "openai package not installed. Add `openai` to requirements.txt and reinstall."
        ) from e
    client = OpenAI()

    chunks = _split_audio_for_api(audio, out_dir)
    log.info("Transcribing %d chunk(s) via OpenAI Whisper API ...", len(chunks))

    full_srt_parts: list[str] = []
    cue_no = 1
    for chunk_path, start_offset in chunks:
        with chunk_path.open("rb") as f:
            resp = client.audio.transcriptions.create(
                model="whisper-1",
                file=f,
                response_format="srt",
                language=language,
            )
        srt_text = resp if isinstance(resp, str) else resp.text
        # Re-number cues and offset timestamps so concatenation is well-formed.
        rewritten = []
        cur_cue: list[str] = []
        def flush():
            nonlocal cue_no, cur_cue
            if cur_cue:
                rewritten.append("\n".join(cur_cue))
                cue_no += 1
                cur_cue = []
        for raw in srt_text.splitlines():
            line = raw.rstrip()
            if line.isdigit():
                flush()
                cur_cue = [str(cue_no)]
            elif "-->" in line:
                a, _, b = line.partition("-->")
                cur_cue.append(_offset_srt_time(a.strip(), start_offset)
                               + " --> "
                               + _offset_srt_time(b.strip(), start_offset))
            elif line.strip() == "":
                flush()
            else:
                cur_cue.append(line)
        flush()
        full_srt_parts.append("\n\n".join(rewritten))
    full_srt = "\n\n".join(full_srt_parts) + "\n"

    srt_path = out_dir / "transcript.srt"
    txt_path = out_dir / "transcript.txt"
    srt_path.write_text(full_srt, encoding="utf-8")
    txt_path.write_text(_srt_to_plain_text(full_srt) + "\n", encoding="utf-8")
    log.info("OpenAI transcript → %s", txt_path)
    return txt_path


def _offset_srt_time(stamp: str, offset_seconds: float) -> str:
    """Add `offset_seconds` to an SRT timestamp string (HH:MM:SS,mmm)."""
    if not stamp:
        return stamp
    hms, _, ms = stamp.partition(",")
    h, m, s = (int(x) for x in hms.split(":"))
    total = h * 3600 + m * 60 + s + (int(ms) / 1000.0 if ms else 0) + offset_seconds
    return _format_srt_timestamp(total)


def transcribe(audio: Path, out_dir: Path, model_size: str, language: str | None) -> Path:
    """Run faster-whisper. Writes transcript.txt + transcript.srt. Returns txt path."""
    log.info("Loading whisper model '%s' (CPU/int8). First run will download weights.", model_size)
    model = WhisperModel(model_size, device="cpu", compute_type="int8")

    log.info("Transcribing %s ...", audio)
    segments, info = model.transcribe(
        str(audio),
        language=language,            # None = auto-detect
        vad_filter=True,              # skip long silences
        beam_size=5,
    )
    log.info("Detected language: %s (p=%.2f)", info.language, info.language_probability)

    txt_path = out_dir / "transcript.txt"
    srt_path = out_dir / "transcript.srt"

    with txt_path.open("w", encoding="utf-8") as f_txt, \
         srt_path.open("w", encoding="utf-8") as f_srt:
        for i, seg in enumerate(segments, start=1):
            text = seg.text.strip()
            f_txt.write(text + "\n")
            f_srt.write(
                f"{i}\n"
                f"{_format_srt_timestamp(seg.start)} --> {_format_srt_timestamp(seg.end)}\n"
                f"{text}\n\n"
            )

    log.info("Wrote %s and %s", txt_path.name, srt_path.name)
    return txt_path


# --------------------------------------------------------------------------- #
# Step 3 — Claude Code → blog post
# --------------------------------------------------------------------------- #
BLOG_USER_PROMPT = """Below is a raw transcript of a video. You watched the video and \
are now writing a blog post in {language} that summarizes its ideas for a reader who didn't.

You are the writer/viewer, NOT the speaker. Write in third person throughout. Refer to the \
speaker by name if the transcript reveals it (otherwise "the speaker"). Never use first \
person ("I", "we", "my team", "my colleagues") — that voice belongs to the speaker, not \
the writer. Attribute claims and opinions to the speaker ("Lapopolo argues…", "according \
to the talk…").

Requirements:
- Compelling title (H1) that names what the talk is about, and clear H2/H3 section headings.
- Open with a 1–3 sentence hook that names the speaker and the central claim.
- Tighten the prose: remove filler, false starts, and verbal repetition. Preserve the \
  speaker's examples, numbers, and arguments — but report them, don't roleplay them.
- Reorganize for clarity if needed — a summary does not have to mirror the spoken order.
- Use Markdown. No HTML, no code-fence wrappers around the whole document.
- Output ONLY the blog post. No preamble like "Here is the blog post:".

TRANSCRIPT:
---
{transcript}
---
"""


# Two-letter language codes to match the on-disk filename suffixes (index.en.md,
# index.zh.md). Extend as needed. The code is what we write to disk; the value
# is the natural-language label we feed to claude.
LANG_LABELS = {
    "en": "English",
    "zh": "Simplified Chinese",
}


def _draft_with_claude(system_prompt: str, user_prompt: str) -> str:
    """Drive the `claude` CLI in headless mode. Auth: ANTHROPIC_API_KEY in env,
    or a prior `claude login` (subscription). We don't enforce either — let the
    CLI surface its own error."""
    if shutil.which("claude") is None:
        raise RuntimeError(
            "`claude` CLI not found on PATH. Install with: "
            "npm install -g @anthropic-ai/claude-code"
        )
    result = subprocess.run(
        ["claude", "-p", user_prompt,
         "--append-system-prompt", system_prompt,
         "--max-turns", "1"],
        check=True, capture_output=True, text=True,
    )
    return result.stdout


def _draft_with_openai(system_prompt: str, user_prompt: str, model: str) -> str:
    """Call OpenAI Chat Completions. Reads OPENAI_API_KEY from env."""
    if not os.environ.get("OPENAI_API_KEY"):
        raise RuntimeError("OPENAI_API_KEY is not set in the environment.")
    try:
        from openai import OpenAI
    except ImportError as e:
        raise RuntimeError(
            "openai package not installed. Add `openai` to requirements.txt and reinstall."
        ) from e
    client = OpenAI()
    resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )
    return resp.choices[0].message.content or ""


def transcript_to_blog(transcript_path: Path, out_dir: Path, blog_language: str,
                       lang_code: str = "en", llm: str = "claude",
                       openai_model: str = "gpt-4o") -> Path:
    """Convert a transcript into a blog post in `blog_language`. Backend chosen
    by `llm` (claude | openai). Writes to `<out_dir>/blog.<lang_code>.md`."""
    transcript = transcript_path.read_text(encoding="utf-8")
    system_prompt = (Path(__file__).parent / "prompts" / "blog_system.md").read_text(encoding="utf-8")
    user_prompt = BLOG_USER_PROMPT.format(language=blog_language, transcript=transcript)

    blog_path = out_dir / f"blog.{lang_code}.md"
    log.info("Drafting %s post via %s → %s", blog_language, llm, blog_path)

    if llm == "claude":
        text = _draft_with_claude(system_prompt, user_prompt)
    elif llm == "openai":
        text = _draft_with_openai(system_prompt, user_prompt, openai_model)
    else:
        raise ValueError(f"Unknown llm backend: {llm!r}. Known: claude, openai.")

    blog_path.write_text(text, encoding="utf-8")
    return blog_path


def transcript_to_blogs(transcript_path: Path, out_dir: Path, lang_codes: list[str],
                        llm: str = "claude", openai_model: str = "gpt-4o") -> dict[str, Path]:
    """Generate one blog markdown per requested language code. Returns {code: path}."""
    paths = {}
    for code in lang_codes:
        label = LANG_LABELS.get(code)
        if not label:
            raise ValueError(f"Unknown language code: {code!r}. Known: {sorted(LANG_LABELS)}")
        paths[code] = transcript_to_blog(transcript_path, out_dir, label, code,
                                         llm=llm, openai_model=openai_model)
    return paths


# --------------------------------------------------------------------------- #
# Step 3.4 — classify the post into our label taxonomy
# --------------------------------------------------------------------------- #
# Three orthogonal axes. The reader picks chips on each axis to filter; within
# an axis it's OR, across axes it's AND. Keep the vocabulary closed so the
# filter bar stays manageable as the post count grows. Free-form `tags`
# still exist alongside these — `labels` is the controlled vocabulary.
LABEL_TAXONOMY: dict[str, list[str]] = {
    "topic": [
        "agents", "llm", "engineering", "product",
        "research", "infra", "security", "business",
    ],
    "format": [
        "keynote", "talk", "workshop",
        "podcast", "interview", "paper",
    ],
    "speaker": [
        "anthropic", "openai", "google", "meta",
        "academia", "independent",
    ],
}


CLASSIFY_PROMPT = """You are tagging a blog post for a reader-facing filter \
UI. Pick the labels that best describe the post from the closed taxonomy \
below. Your output is a single JSON object — nothing else, no prose.

Rules:
- Pick 1–3 topic labels (the post's actual subject matter).
- Pick exactly 1 format label (how the speaker delivered the content).
- Pick exactly 1 speaker label (the speaker's affiliation; pick "independent" \
if they don't represent a major lab/company, "academia" for university \
researchers).
- Use only the values listed below. Do not invent new ones.
- Output shape:
  {{"topic": ["..."], "format": "...", "speaker": "..."}}

Taxonomy:
- topic ∈ {topic_values}
- format ∈ {format_values}
- speaker ∈ {speaker_values}

POST TITLE: {title}
POST EXCERPT:
---
{excerpt}
---"""


def classify_labels(blog_md: Path, openai_text_model: str = "gpt-4o") -> list[str]:
    """Ask the text model to classify the post into our taxonomy. Returns a
    flat `["topic:agents", "format:podcast", ...]` list. On any failure
    returns []; the caller should still ship the post — the labels are
    additive, not load-bearing."""
    if not os.environ.get("OPENAI_API_KEY"):
        return []
    try:
        from openai import OpenAI
    except ImportError:
        return []

    text = blog_md.read_text(encoding="utf-8")
    title, _ = _parse_blog_md(text)
    excerpt = text[:8000]

    prompt = CLASSIFY_PROMPT.format(
        topic_values=", ".join(LABEL_TAXONOMY["topic"]),
        format_values=", ".join(LABEL_TAXONOMY["format"]),
        speaker_values=", ".join(LABEL_TAXONOMY["speaker"]),
        title=title,
        excerpt=excerpt,
    )
    log.info("Classifying labels via %s ...", openai_text_model)
    try:
        client = OpenAI()
        resp = client.chat.completions.create(
            model=openai_text_model,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.1,
        )
        raw = (resp.choices[0].message.content or "").strip()
        data = json.loads(raw)
    except Exception as e:
        log.warning("Label classification failed (%s); shipping without labels.", e)
        return []

    labels: list[str] = []
    for v in (data.get("topic") or []):
        if v in LABEL_TAXONOMY["topic"]:
            labels.append(f"topic:{v}")
    fmt = data.get("format")
    if fmt in LABEL_TAXONOMY["format"]:
        labels.append(f"format:{fmt}")
    spk = data.get("speaker")
    if spk in LABEL_TAXONOMY["speaker"]:
        labels.append(f"speaker:{spk}")

    log.info("Labels: %s", ", ".join(labels) or "(none)")
    return labels


# --------------------------------------------------------------------------- #
# Step 3.5 — generate a content-aware diagram image from the EN draft
# --------------------------------------------------------------------------- #
# Two-step pipeline. (1) A text model reads the full post and produces a
# focused visual brief — 3–5 concrete elements the diagram should depict
# plus a composition hint. (2) The image model renders that brief as a
# labeled diagram. Without step 1 the image model gets too much text and
# falls back to vague editorial illustrations that don't explain anything.

VISUAL_BRIEF_PROMPT = """You are a visual editor briefing an illustrator on a \
diagram for a tech blog post. Read the post below and identify the 3–5 most \
important *depictable* things — processes, components, contrasts, or analogies \
the author actually uses. Skip pure abstractions ("trust", "innovation").

Reply in this exact format, nothing else:

COMPOSITION: <one sentence: e.g. "left-to-right flow", "before/after split", \
"hub-and-spoke around a central loop", "stacked layers".>
ELEMENTS:
1. <short noun-phrase label> — <one-line visual hint: what the illustrator \
   draws for this, including any concrete object/icon to anchor it>
2. ...
3. ...
RELATIONSHIPS: <one sentence on how the elements connect or contrast>

POST TITLE: {title}
POST:
---
{post}
---"""

DIAGRAM_PROMPT = """Create a clear, content-explaining illustration for a \
technology blog post. The image must communicate the post's actual ideas — \
think editorial infographic or annotated diagram rather than abstract cover art.

Visual brief (from the editor):
{brief}

Style: hand-drawn editorial diagram, restrained palette (2–3 colors plus an \
off-white background), clean line work. Lay out the labelled elements according \
to the brief's COMPOSITION. Use short one- or two-word labels next to each \
element — make them legible. Use simple connectors (arrows, brackets, lines) \
to show the RELATIONSHIPS. The overall feel should be informative, like a \
diagram from a Stripe Press book or a NYTimes explainer, not a poster. \
Square format."""


def _visual_brief_from_blog(text: str, title: str, openai_text_model: str) -> str | None:
    """Ask GPT-4-class model to extract a diagram brief from the blog.
    Returns the brief string or None if the call fails (caller should fall
    back to the title+dek heuristic)."""
    try:
        from openai import OpenAI
    except ImportError:
        return None
    # Trim very long posts so we stay well within context. ~15k chars is plenty
    # for the brief — the model just needs the main ideas, not every example.
    excerpt = text[:15000]
    client = OpenAI()
    try:
        resp = client.chat.completions.create(
            model=openai_text_model,
            messages=[{
                "role": "user",
                "content": VISUAL_BRIEF_PROMPT.format(title=title, post=excerpt),
            }],
            temperature=0.4,
        )
    except Exception as e:
        log.warning("Visual brief request failed (%s); will fall back to title+dek.", e)
        return None
    brief = (resp.choices[0].message.content or "").strip()
    return brief or None


def generate_blog_image(en_blog_md: Path, out_dir: Path,
                        model: str = "gpt-image-1",
                        size: str = "1024x1024",
                        quality: str = "medium",
                        text_model: str = "gpt-4o") -> Path | None:
    """Generate a content-aware diagram image for the EN blog.
    Saves to <out_dir>/cover.png. Returns the path on success, None on
    failure (caller should treat the image as optional)."""
    if not os.environ.get("OPENAI_API_KEY"):
        log.warning("OPENAI_API_KEY not set — skipping cover image.")
        return None
    try:
        from openai import OpenAI
    except ImportError:
        log.warning("openai package not installed — skipping cover image.")
        return None

    text = en_blog_md.read_text(encoding="utf-8")
    title, dek = _parse_blog_md(text)

    # Step 1: ask a text model what to draw.
    log.info("Drafting visual brief via %s ...", text_model)
    brief = _visual_brief_from_blog(text, title, text_model)
    if brief is None:
        # Last-resort fallback so we still emit *something*.
        brief = (
            f"COMPOSITION: simple central diagram\n"
            f"ELEMENTS:\n1. {title} — central element\n"
            f"RELATIONSHIPS: derived from {dek or title}"
        )
    # Stash the brief alongside the image — useful for inspecting why a
    # given diagram came out the way it did, and for re-runs.
    try:
        (out_dir / "cover_brief.txt").write_text(brief + "\n", encoding="utf-8")
    except Exception:
        pass

    prompt = DIAGRAM_PROMPT.format(brief=brief)

    # Step 2: render the brief.
    log.info("Generating diagram image via OpenAI %s (%s, %s) ...", model, size, quality)
    client = OpenAI()
    try:
        kwargs = {"model": model, "prompt": prompt, "size": size, "n": 1}
        if model == "gpt-image-1":
            kwargs["quality"] = quality
        resp = client.images.generate(**kwargs)
    except Exception as e:
        log.warning("Image generation failed (%s); continuing without cover.", e)
        return None

    img_path = out_dir / "cover.png"
    item = resp.data[0]
    try:
        if getattr(item, "b64_json", None):
            import base64
            img_path.write_bytes(base64.b64decode(item.b64_json))
        elif getattr(item, "url", None):
            import urllib.request
            urllib.request.urlretrieve(item.url, img_path)
        else:
            log.warning("OpenAI image response had neither b64_json nor url.")
            return None
    except Exception as e:
        log.warning("Failed to save image (%s); continuing without cover.", e)
        return None

    log.info("Cover image → %s (%d bytes)", img_path, img_path.stat().st_size)
    return img_path


# --------------------------------------------------------------------------- #
# Step 4 — publish to blog-repo
# --------------------------------------------------------------------------- #
def _slugify(text: str, max_len: int = 60) -> str:
    s = text.lower()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"\s+", "-", s).strip("-")
    s = re.sub(r"-{2,}", "-", s)
    if len(s) > max_len:
        # Truncate on a word boundary so we don't cut mid-word.
        s = s[:max_len].rsplit("-", 1)[0]
    return s.rstrip("-") or "post"


def _parse_blog_md(md_text: str) -> tuple[str, str]:
    """Pull H1 title and the first non-heading paragraph (dek) from blog.md."""
    title, dek = "Untitled", ""
    for line in md_text.splitlines():
        s = line.strip()
        if s.startswith("# "):
            title = s[2:].strip()
            break
    after_h1 = md_text.split("\n", 1)[1] if "\n" in md_text else ""
    for para in re.split(r"\n\s*\n", after_h1):
        p = para.strip()
        if p and not p.startswith("#"):
            dek = re.sub(r"\s+", " ", p)[:240]
            break
    return title, dek


def _insert_cover_after_h1(md_text: str, image_url: str, alt: str) -> str:
    """Return md_text with `![alt](image_url)` inserted right after the H1.
    No-op if the markdown already starts with a hosted image at that URL."""
    if image_url in md_text.split("\n", 5)[1] if "\n" in md_text else "":
        return md_text  # already inserted
    lines = md_text.splitlines()
    out: list[str] = []
    inserted = False
    for line in lines:
        out.append(line)
        if not inserted and line.startswith("# "):
            out.append("")
            out.append(f"![{alt}]({image_url})")
            inserted = True
    if not inserted:
        out = [f"![{alt}]({image_url})", ""] + out
    return "\n".join(out) + ("\n" if md_text.endswith("\n") else "")


def publish_to_blog_repo(
    blog_paths: dict[str, Path],
    blog_repo: Path,
    source_url: str | None = None,
    tags: list[str] | None = None,
    commit: bool = True,
    cover_image: Path | None = None,
    labels: list[str] | None = None,
) -> Path:
    """Drop the post into <blog_repo>/public/blog/<slug>/ and update posts.json.

    `blog_paths` is `{lang_code: blog.<code>.md path}` — at minimum {'en': ...}.
    The English version is the canonical one for slug + date + manifest dek.

    Layout:
        public/blog/<slug>/
            index.en.md      (always)
            index.zh.md      (if 'zh' in blog_paths)
            meta.json
        public/blog/posts.json   # top-level manifest, listing all slugs

    Optionally creates a local commit. Never pushes — user pushes manually.
    """
    if not blog_repo.exists() or not (blog_repo / ".git").exists():
        raise RuntimeError(f"{blog_repo} is not a git repository")
    if "en" not in blog_paths:
        raise ValueError("blog_paths must include at least an 'en' entry.")

    public_blog = blog_repo / "public" / "blog"
    public_blog.mkdir(parents=True, exist_ok=True)
    manifest = public_blog / "posts.json"

    en_text = blog_paths["en"].read_text(encoding="utf-8")
    title, dek_en = _parse_blog_md(en_text)
    slug = _slugify(title)
    date = _dt.date.today().isoformat()

    post_dir = public_blog / slug
    post_dir.mkdir(exist_ok=True)

    # Stage the cover image first so we know its URL when injecting the
    # markdown reference. Path stays as `/images/blog/<slug>.png` — the
    # publish-dist workflow rewrites this to a CDN URL for dist_remote.
    image_url: str | None = None
    if cover_image is not None and cover_image.exists():
        images_dir = blog_repo / "public" / "images" / "blog"
        images_dir.mkdir(parents=True, exist_ok=True)
        target_img = images_dir / f"{slug}{cover_image.suffix or '.png'}"
        shutil.copyfile(cover_image, target_img)
        image_url = f"/images/blog/{target_img.name}"
        log.info("Cover image → %s", target_img.relative_to(blog_repo))

    languages: list[str] = []
    deks: dict[str, str] = {}
    titles: dict[str, str] = {}
    for code, path in blog_paths.items():
        text = path.read_text(encoding="utf-8")
        if image_url:
            text = _insert_cover_after_h1(text, image_url, alt=title)
        t, d = _parse_blog_md(text)
        titles[code] = t
        deks[code] = d
        languages.append(code)
        (post_dir / f"index.{code}.md").write_text(text, encoding="utf-8")
    languages.sort(key=lambda c: 0 if c == "en" else 1)  # en first

    meta = {
        "slug": slug,
        "title_en": titles.get("en", title),
        "date": date,
        "dek_en": deks.get("en", dek_en),
        "tags": tags or [],
        "languages": languages,
    }
    if "zh" in titles:
        meta["title_zh"] = titles["zh"]
    if "zh" in deks:
        meta["dek_zh"] = deks["zh"]
    if source_url:
        meta["source"] = source_url
    if image_url:
        meta["image"] = image_url
    if labels:
        meta["labels"] = labels

    (post_dir / "meta.json").write_text(
        json.dumps(meta, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    log.info("Wrote post → %s/", post_dir.relative_to(blog_repo))

    posts: list[dict] = []
    if manifest.exists():
        try:
            posts = json.loads(manifest.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            log.warning("posts.json was unreadable; rewriting from scratch.")
            posts = []
    posts = [p for p in posts if p.get("slug") != slug]
    posts.insert(0, meta)
    posts.sort(key=lambda p: p.get("date", ""), reverse=True)
    manifest.write_text(json.dumps(posts, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    log.info("Updated manifest → %s (%d posts)", manifest.relative_to(blog_repo), len(posts))

    if commit:
        rel_dir = post_dir.relative_to(blog_repo)
        rel_json = manifest.relative_to(blog_repo)
        paths_to_add = [str(rel_dir), str(rel_json)]
        if image_url:
            paths_to_add.append(str(target_img.relative_to(blog_repo)))
        subprocess.run(["git", "-C", str(blog_repo), "add", *paths_to_add], check=True)
        diff = subprocess.run(["git", "-C", str(blog_repo), "diff", "--cached", "--quiet"])
        if diff.returncode == 0:
            log.info("No changes to commit (post unchanged).")
        else:
            msg = f"blog: {title}"
            subprocess.run(["git", "-C", str(blog_repo), "commit", "-m", msg], check=True)
            log.info("Committed in %s. Run `git -C %s push` when ready.", blog_repo, blog_repo)

    return post_dir


# --------------------------------------------------------------------------- #
# Entry point
# --------------------------------------------------------------------------- #
STAGES = ("audio", "transcript", "blog", "publish")


def _audio_exists(out: Path) -> bool:
    p = out / "source.mp3"
    return p.exists() and p.stat().st_size > 0


def _transcript_exists(out: Path) -> bool:
    p = out / "transcript.txt"
    return p.exists() and p.stat().st_size > 0


def _blog_exists(out: Path) -> bool:
    # Canonical English version is the gate. Tiny files (e.g. a stale
    # auth-error message) are treated as missing.
    p = out / "blog.en.md"
    if p.exists() and p.stat().st_size > 200:
        return True
    legacy = out / "blog.md"
    return legacy.exists() and legacy.stat().st_size > 200


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    src = parser.add_mutually_exclusive_group(required=False)
    src.add_argument("--url", help="Video URL (anything yt-dlp supports)")
    src.add_argument("--file", type=Path, help="Path to a local video file")

    parser.add_argument("--out", type=Path, default=Path("/data/out"),
                        help="Output directory (default: /data/out)")
    parser.add_argument("--model", default=os.environ.get("WHISPER_MODEL", "small"),
                        choices=["tiny", "base", "small", "medium", "large-v3"],
                        help="faster-whisper model size (default: small)")
    parser.add_argument("--language", default=None,
                        help="Source language code (e.g. en, zh, de). Default: auto-detect.")
    parser.add_argument("--blog-languages", default="en,zh",
                        help="Comma-separated language codes for the blog drafts. "
                             f"Known: {','.join(sorted(LANG_LABELS))}. Default: en,zh.")
    parser.add_argument("--llm", choices=["claude", "openai"],
                        default=os.environ.get("LLM_BACKEND", "claude"),
                        help="LLM backend for the blog step. claude (CLI, "
                             "default) uses ANTHROPIC_API_KEY or `claude login`; "
                             "openai uses OPENAI_API_KEY.")
    parser.add_argument("--openai-model", default=os.environ.get("OPENAI_MODEL", "gpt-4o"),
                        help="OpenAI model name when --llm openai (default: gpt-4o).")
    parser.add_argument("--image", choices=["auto", "off"], default="auto",
                        help="auto (default): generate a cover image with OpenAI's "
                             "image API after the EN draft, embed it as a hero image "
                             "at the top of each language version, and store it under "
                             "public/images/blog/<slug>.png. Skipped silently if "
                             "OPENAI_API_KEY is unset. off: don't generate an image.")
    parser.add_argument("--image-model", default=os.environ.get("IMAGE_MODEL", "gpt-image-1"),
                        choices=["gpt-image-1", "dall-e-3"],
                        help="OpenAI image model (default: gpt-image-1).")
    parser.add_argument("--yt-cookies", type=Path, default=None,
                        help="Netscape-format cookies file passed to yt-dlp. Use this "
                             "when YouTube returns 'Sign in to confirm you're not a bot' "
                             "(common from cloud/CI runners).")
    parser.add_argument("--transcribe", choices=["auto", "local", "openai"], default="auto",
                        help="Transcription engine when no captions are available. "
                             "auto: prefer the OpenAI Whisper API when OPENAI_API_KEY is "
                             "set (fast cloud transcription), else fall back to local "
                             "faster-whisper. local: always use faster-whisper. "
                             "openai: always use the OpenAI Whisper API (requires the key).")
    parser.add_argument("--captions", choices=["auto", "off", "only"], default="auto",
                        help="auto (default): try fetching the video's existing captions "
                             "first; fall back to download + whisper if none exist. "
                             "off: skip captions, always download audio and transcribe. "
                             "only: fail if no captions are available (no whisper fallback).")
    parser.add_argument("--from", dest="from_stage", choices=STAGES, default=None,
                        help="Resume from this stage (audio|transcript|blog). Earlier "
                             "stages are skipped — their outputs must already exist in --out. "
                             "Without this flag, each stage auto-skips if its output is present.")
    parser.add_argument("--force", action="store_true",
                        help="Re-run every stage from scratch, ignoring existing outputs.")
    parser.add_argument("--skip-blog", action="store_true",
                        help="Stop after transcription; do not call Claude Code.")
    parser.add_argument("--blog-repo", type=Path, default=None,
                        help="Path to a local clone of the blog repo. If set, the publish "
                             "stage runs and drops the post into <repo>/public/blog/.")
    parser.add_argument("--tags", default="",
                        help="Comma-separated tags for the published post (e.g. 'agents,llm').")
    parser.add_argument("--no-commit", action="store_true",
                        help="Skip the git commit during publish (just write files).")
    parser.add_argument("-v", "--verbose", action="store_true")
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s  %(levelname)-7s  %(message)s",
        datefmt="%H:%M:%S",
    )

    args.out.mkdir(parents=True, exist_ok=True)

    # Decide which stages to run.
    start_idx = STAGES.index(args.from_stage) if args.from_stage else 0
    def should_run(stage: str, output_exists_fn) -> bool:
        if args.force:
            return True
        idx = STAGES.index(stage)
        if idx < start_idx:
            return False  # explicitly skipped via --from
        if args.from_stage is not None and idx >= start_idx:
            return True   # explicit resume: always run from here forward
        return not output_exists_fn(args.out)  # auto-skip mode

    # If a later stage will run, the earlier stages' outputs must exist.
    if args.from_stage == "transcript" and not _audio_exists(args.out):
        log.error("--from transcript requires %s to exist.", args.out / "source.mp3")
        return 2
    if args.from_stage == "blog" and not _transcript_exists(args.out):
        log.error("--from blog requires %s to exist.", args.out / "transcript.txt")
        return 2
    if args.from_stage == "publish" and not _blog_exists(args.out):
        log.error("--from publish requires %s to exist.", args.out / "blog.md")
        return 2
    if args.from_stage == "publish" and args.blog_repo is None:
        log.error("--from publish requires --blog-repo PATH.")
        return 2

    try:
        # Step 1: audio (with optional caption fast-path).
        audio = args.out / "source.mp3"
        captions_used = False
        # Try captions first when we have a URL — it's seconds vs tens of
        # minutes for whisper. Only attempt this when both audio + transcript
        # would otherwise run; if the user is already past those stages
        # (--from blog), don't redo work.
        if (args.url and args.captions != "off"
                and should_run("audio", _audio_exists)
                and should_run("transcript", _transcript_exists)):
            cap = try_captions(args.url, args.out, cookies=args.yt_cookies)
            if cap is not None:
                captions_used = True
            elif args.captions == "only":
                log.error("--captions only was set but no captions were available.")
                return 2

        if not captions_used:
            if should_run("audio", _audio_exists):
                if not (args.url or args.file):
                    log.error("Stage 'audio' needs --url or --file.")
                    return 2
                if args.url:
                    audio = download_audio(args.url, args.out, cookies=args.yt_cookies)
                else:
                    if not args.file.exists():
                        log.error("File not found: %s", args.file)
                        return 2
                    audio = extract_audio_from_file(args.file, args.out)
            else:
                log.info("Skipping audio stage (using existing %s).", audio)

        # Step 2: transcript
        transcript_path = args.out / "transcript.txt"
        if captions_used:
            log.info("Skipping transcribe stage (captions provided the transcript).")
        elif should_run("transcript", _transcript_exists):
            engine = args.transcribe
            if engine == "auto":
                engine = "openai" if os.environ.get("OPENAI_API_KEY") else "local"
            if engine == "openai":
                transcript_path = transcribe_with_openai(audio, args.out, args.language)
            else:
                transcript_path = transcribe(audio, args.out, args.model, args.language)
        else:
            log.info("Skipping transcript stage (using existing %s).", transcript_path)

        # Step 3: blog (one markdown per requested language).
        lang_codes = [c.strip() for c in args.blog_languages.split(",") if c.strip()]
        if "en" not in lang_codes:
            log.error("--blog-languages must include 'en' (English is canonical for the slug).")
            return 2
        if args.skip_blog:
            log.info("Skipping blog step (--skip-blog).")
            blog_paths = {c: args.out / f"blog.{c}.md" for c in lang_codes}
        elif should_run("blog", _blog_exists):
            blog_paths = transcript_to_blogs(
                transcript_path, args.out, lang_codes,
                llm=args.llm, openai_model=args.openai_model,
            )
            for code, p in blog_paths.items():
                log.info("Drafted %s blog → %s", LANG_LABELS[code], p)
        else:
            blog_paths = {c: args.out / f"blog.{c}.md" for c in lang_codes}
            log.info("Skipping blog stage (using existing %s). Pass --from blog to redraft.",
                     blog_paths.get("en"))

        # Step 3.4: classify labels from the closed taxonomy (additive — does
        # not replace --tags, both fields persist on the post).
        auto_labels: list[str] = []
        if (not args.skip_blog and "en" in blog_paths
                and blog_paths["en"].exists()):
            auto_labels = classify_labels(blog_paths["en"])

        # Step 3.5: cover image (between draft and publish, so publish can
        # embed the image ref in each markdown variant).
        cover_image: Path | None = None
        cover_path = args.out / "cover.png"
        if (args.image == "auto" and not args.skip_blog
                and "en" in blog_paths and blog_paths["en"].exists()):
            if cover_path.exists() and cover_path.stat().st_size > 0:
                log.info("Reusing existing cover image %s.", cover_path)
                cover_image = cover_path
            else:
                cover_image = generate_blog_image(
                    blog_paths["en"], args.out, model=args.image_model,
                )

        # Step 4: publish (only if a blog-repo is configured, or explicitly requested).
        if args.blog_repo is not None or args.from_stage == "publish":
            if args.skip_blog:
                log.info("Skipping publish (--skip-blog set).")
            else:
                source_url = None
                src_url_path = args.out / "source.url"
                if args.url:
                    source_url = args.url
                elif src_url_path.exists():
                    source_url = src_url_path.read_text(encoding="utf-8").strip() or None
                tags = [t.strip() for t in args.tags.split(",") if t.strip()] if args.tags else []
                # Drop any languages whose blog file is missing (e.g. partial reruns).
                resolved = {c: p for c, p in blog_paths.items() if p.exists() and p.stat().st_size > 200}
                if "en" not in resolved:
                    log.error("Cannot publish: %s is missing.", blog_paths.get("en"))
                    return 2
                # If --from publish and an image was produced earlier, reuse it.
                if cover_image is None and cover_path.exists() and cover_path.stat().st_size > 0:
                    cover_image = cover_path
                published = publish_to_blog_repo(
                    resolved,
                    args.blog_repo,
                    source_url=source_url,
                    tags=tags,
                    commit=not args.no_commit,
                    cover_image=cover_image,
                    labels=auto_labels,
                )
                log.info("Published to %s", published)

    except subprocess.CalledProcessError as e:
        log.error("Subprocess failed (%s): %s", e.returncode, " ".join(map(str, e.cmd)))
        return e.returncode
    except Exception as e:
        log.error("Pipeline error: %s", e)
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
