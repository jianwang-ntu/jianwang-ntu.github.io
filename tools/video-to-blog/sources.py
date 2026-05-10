"""Acquire blog source text from non-video inputs.

The video pipeline already produces a `transcript.txt` from audio. For paper
PDFs and short-form web posts (LinkedIn et al.) the equivalent acquisition
step is text extraction, not transcription. This module returns a
`SourceBundle` that downstream stages treat the same way they treat a
transcript: raw text + a kind tag that selects the right prompt template.

Three intake paths:
    pdf(path-or-url)   → kind="paper"   (arXiv URLs auto-recognised)
    linkedin(url)      → kind="post"    (og: meta-tag scrape; manual fallback)
    text_file(path)    → kind=user-asserted (escape hatch when scraping fails)
"""
from __future__ import annotations

import logging
import re
import urllib.parse
import urllib.request
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path

log = logging.getLogger("pipeline.sources")

_BROWSER_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)


@dataclass
class SourceBundle:
    """Normalised handoff between source acquisition and the blog stage."""
    kind: str            # "video" | "paper" | "post"
    text: str            # body to summarise
    source_url: str | None = None
    title_hint: str | None = None
    author_hint: str | None = None


# --------------------------------------------------------------------------- #
# arXiv
# --------------------------------------------------------------------------- #
# Match abs/, pdf/, html/ forms and the optional .pdf suffix. We capture the
# bare arXiv id so we can canonicalise to the PDF URL ourselves.
_ARXIV_RE = re.compile(
    r"^https?://(?:www\.)?arxiv\.org/(?:abs|pdf|html)/(?P<id>[\w.\-/]+?)(?:\.pdf)?/?$",
    re.IGNORECASE,
)


def is_arxiv_url(url: str) -> bool:
    return bool(_ARXIV_RE.match(url.strip()))


def arxiv_pdf_url(url: str) -> str:
    """Rewrite any arXiv URL form to the canonical PDF URL."""
    m = _ARXIV_RE.match(url.strip())
    if not m:
        return url
    return f"https://arxiv.org/pdf/{m.group('id')}.pdf"


def is_linkedin_url(url: str) -> bool:
    p = urllib.parse.urlparse(url.strip())
    return p.netloc.endswith("linkedin.com")


# --------------------------------------------------------------------------- #
# PDF (file or URL)
# --------------------------------------------------------------------------- #
def _download(url: str, dest: Path) -> Path:
    log.info("Downloading %s → %s", url, dest)
    req = urllib.request.Request(url, headers={"User-Agent": _BROWSER_UA})
    with urllib.request.urlopen(req, timeout=60) as r, open(dest, "wb") as f:
        f.write(r.read())
    return dest


def _extract_pdf_text(pdf_path: Path) -> tuple[str, str | None]:
    """Return (body_text, title_hint). Title comes from PDF metadata when set."""
    try:
        from pypdf import PdfReader
    except ImportError as e:
        raise RuntimeError(
            "pypdf not installed. Add `pypdf` to tools/video-to-blog/requirements.txt "
            "and reinstall the venv."
        ) from e

    reader = PdfReader(str(pdf_path))
    pages = []
    for i, page in enumerate(reader.pages):
        try:
            pages.append(page.extract_text() or "")
        except Exception as e:  # pypdf occasionally chokes on a single page
            log.warning("PDF page %d extraction failed (%s); skipping page.", i, e)
    text = "\n\n".join(p.strip() for p in pages if p and p.strip())

    title = None
    try:
        meta = reader.metadata or {}
        title = (meta.get("/Title") or "").strip() or None
    except Exception:
        pass

    return text, title


def from_pdf(path_or_url: str, out_dir: Path) -> SourceBundle:
    """Resolve a PDF (local path or http(s) URL — arXiv URLs auto-canonicalised),
    extract text, and write a copy of the binary into out_dir for reference."""
    src = path_or_url.strip()
    if src.startswith(("http://", "https://")):
        url = arxiv_pdf_url(src) if is_arxiv_url(src) else src
        local = out_dir / "source.pdf"
        _download(url, local)
        source_url = src  # preserve the URL the user actually passed
    else:
        local = Path(src).expanduser().resolve()
        if not local.exists():
            raise FileNotFoundError(f"PDF not found: {local}")
        # Copy into out_dir so reruns don't depend on the original location.
        cached = out_dir / "source.pdf"
        if cached.resolve() != local:
            cached.write_bytes(local.read_bytes())
        local = cached
        source_url = None

    text, title_hint = _extract_pdf_text(local)
    if len(text) < 400:
        raise RuntimeError(
            f"PDF text extraction returned only {len(text)} chars from {local}. "
            "If this is a scanned PDF, run OCR first and pass --text-file."
        )
    log.info("PDF text: %d chars across %d pages", len(text),
             max(1, text.count("\n\n") + 1))
    return SourceBundle(
        kind="paper",
        text=text,
        source_url=source_url,
        title_hint=title_hint,
    )


def extract_pdf_figures(
    pdf_path: Path,
    out_dir: Path,
    max_pages: int = 8,
    min_width: int = 300,
    min_height: int = 200,
    max_candidates: int = 5,
) -> list[Path]:
    """Extract candidate overview/architecture figures from a PDF.

    Scans the first *max_pages* pages, filters embedded images by minimum
    pixel dimensions, converts them to RGB PNG, saves each to
    ``out_dir/fig_p{page}_{n}.png``, and returns paths sorted so the
    largest images on the earliest pages come first (up to *max_candidates*).

    Returns an empty list when pypdf or Pillow is unavailable, or when no
    qualifying images are found — callers should fall back to generative cover.
    """
    try:
        from pypdf import PdfReader
        from PIL import Image
        import io
    except ImportError:
        log.warning("pypdf[image] or Pillow not installed — skipping PDF figure extraction.")
        return []

    try:
        reader = PdfReader(str(pdf_path))
    except Exception as e:
        log.warning("Could not open PDF for figure extraction (%s).", e)
        return []

    candidates: list[tuple[int, int, int, Path]] = []  # (page_idx, -area, seq, path)
    out_dir.mkdir(parents=True, exist_ok=True)

    for page_idx, page in enumerate(reader.pages[:max_pages]):
        try:
            page_images = list(page.images)
        except Exception as e:
            log.debug("Page %d image extraction failed: %s", page_idx + 1, e)
            continue

        for seq, img_obj in enumerate(page_images):
            try:
                pil_img = img_obj.image  # PIL Image from pypdf
                w, h = pil_img.size
                if w < min_width or h < min_height:
                    continue

                # Convert to plain RGB PNG (handles RGBA transparency, CMYK, etc.)
                if pil_img.mode not in ("RGB", "L"):
                    bg = Image.new("RGB", pil_img.size, (255, 255, 255))
                    if pil_img.mode == "RGBA":
                        bg.paste(pil_img, mask=pil_img.split()[3])
                    else:
                        bg.paste(pil_img.convert("RGB"))
                    pil_img = bg
                elif pil_img.mode == "L":
                    pil_img = pil_img.convert("RGB")

                out_path = out_dir / f"fig_p{page_idx + 1}_{seq}.png"
                pil_img.save(str(out_path), format="PNG")
                area = w * h
                candidates.append((page_idx, -area, seq, out_path))
                log.debug("Figure candidate: page %d, %dx%d → %s", page_idx + 1, w, h, out_path.name)
            except Exception as e:
                log.debug("Skipping image on page %d seq %d: %s", page_idx + 1, seq, e)

    # Sort: earlier pages first; within same page, larger images first.
    candidates.sort(key=lambda t: (t[0], t[1]))
    result = [t[3] for t in candidates[:max_candidates]]
    if result:
        log.info("Extracted %d figure candidate(s) from PDF (kept top %d).",
                 len(candidates), len(result))
    return result


# --------------------------------------------------------------------------- #
# LinkedIn (and other social posts) — best-effort og: meta scrape
# --------------------------------------------------------------------------- #
class _MetaCollector(HTMLParser):
    """Pull og:* and twitter:* meta tags out of an HTML head. Stops on </head>."""
    def __init__(self) -> None:
        super().__init__()
        self.meta: dict[str, str] = {}
        self.title: str | None = None
        self._in_title = False
        self._stop = False

    def handle_starttag(self, tag, attrs):
        if self._stop:
            return
        if tag == "meta":
            d = dict(attrs)
            key = (d.get("property") or d.get("name") or "").lower()
            content = d.get("content")
            if key and content:
                self.meta[key] = content
        elif tag == "title":
            self._in_title = True

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        if tag == "head":
            self._stop = True

    def handle_data(self, data):
        if self._in_title and not self.title:
            t = data.strip()
            if t:
                self.title = t


def from_linkedin(url: str, out_dir: Path) -> SourceBundle:
    """Fetch a LinkedIn post URL and extract whatever the public meta tags
    expose. LinkedIn paywalls most content, so this is best-effort: when the
    extracted text is too short, we raise with a hint to use --text-file."""
    log.info("Fetching LinkedIn post: %s", url)
    req = urllib.request.Request(url, headers={"User-Agent": _BROWSER_UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            raw = r.read().decode("utf-8", errors="replace")
    except Exception as e:
        raise RuntimeError(
            f"Could not fetch LinkedIn URL ({e}). LinkedIn often blocks direct "
            "fetches; copy the post body into a file and rerun with "
            "--text-file <path> --kind post."
        )

    # Cache the raw HTML alongside the text so reruns can re-extract.
    (out_dir / "source.html").write_text(raw, encoding="utf-8")

    parser = _MetaCollector()
    try:
        parser.feed(raw)
    except Exception:
        pass  # best-effort

    title_hint = parser.meta.get("og:title") or parser.title
    description = parser.meta.get("og:description") or parser.meta.get("description") or ""
    author_hint = (parser.meta.get("article:author")
                   or parser.meta.get("og:article:author")
                   or parser.meta.get("author"))

    text = description.strip()
    if len(text) < 200:
        raise RuntimeError(
            f"LinkedIn page yielded only {len(text)} chars of public text "
            "(login wall). Copy the post body into a file and rerun with "
            "--text-file <path> --kind post."
        )
    log.info("LinkedIn post: %d chars (og:description); title=%r author=%r",
             len(text), title_hint, author_hint)
    return SourceBundle(
        kind="post",
        text=text,
        source_url=url,
        title_hint=title_hint,
        author_hint=author_hint,
    )


# --------------------------------------------------------------------------- #
# Manual escape hatch — pre-extracted text
# --------------------------------------------------------------------------- #
def from_text_file(path: str, kind: str, source_url: str | None = None,
                   title_hint: str | None = None) -> SourceBundle:
    p = Path(path).expanduser().resolve()
    if not p.exists():
        raise FileNotFoundError(f"Text file not found: {p}")
    text = p.read_text(encoding="utf-8").strip()
    if len(text) < 100:
        raise RuntimeError(f"Text file is suspiciously short ({len(text)} chars): {p}")
    if kind not in {"video", "paper", "post"}:
        raise ValueError(f"--kind must be one of video/paper/post, got {kind!r}")
    log.info("Loaded %d chars from %s as kind=%s", len(text), p, kind)
    return SourceBundle(
        kind=kind,
        text=text,
        source_url=source_url,
        title_hint=title_hint,
    )


# --------------------------------------------------------------------------- #
# Auto-detect from a positional URL
# --------------------------------------------------------------------------- #
def auto_detect_kind(url: str) -> str:
    """Classify a URL into video|paper|post for blog.sh's positional path.

    Conservative: we only special-case patterns we explicitly support.
    Everything else falls through to "video" (yt-dlp tries hard).
    """
    if is_arxiv_url(url):
        return "paper"
    p = urllib.parse.urlparse(url.strip())
    host = p.netloc.lower()
    if host.endswith("linkedin.com"):
        return "post"
    # Direct PDF link — heuristic only; the path may rewrite at fetch time.
    if p.path.lower().endswith(".pdf"):
        return "paper"
    return "video"
