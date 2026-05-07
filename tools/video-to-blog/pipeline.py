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
# Step 2 — transcribe
# --------------------------------------------------------------------------- #
def _format_srt_timestamp(seconds: float) -> str:
    ms = int(round(seconds * 1000))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


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


def publish_to_blog_repo(
    blog_paths: dict[str, Path],
    blog_repo: Path,
    source_url: str | None = None,
    tags: list[str] | None = None,
    commit: bool = True,
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

    languages: list[str] = []
    deks: dict[str, str] = {}
    titles: dict[str, str] = {}
    for code, path in blog_paths.items():
        text = path.read_text(encoding="utf-8")
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
        subprocess.run(["git", "-C", str(blog_repo), "add", str(rel_dir), str(rel_json)],
                       check=True)
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
    parser.add_argument("--yt-cookies", type=Path, default=None,
                        help="Netscape-format cookies file passed to yt-dlp. Use this "
                             "when YouTube returns 'Sign in to confirm you're not a bot' "
                             "(common from cloud/CI runners).")
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
        # Step 1: audio
        audio = args.out / "source.mp3"
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
        if should_run("transcript", _transcript_exists):
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
                published = publish_to_blog_repo(
                    resolved,
                    args.blog_repo,
                    source_url=source_url,
                    tags=tags,
                    commit=not args.no_commit,
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
