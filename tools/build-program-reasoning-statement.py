#!/usr/bin/env python3
"""Build the two-page Program Reasoning research statement from Markdown."""

import argparse
import html
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'src/content/program-reasoning-statement.md'
OUTPUT = ROOT / 'public/data/Jian_Wang_Program_Reasoning_Statement_2026.pdf'
TITLE = 'Reliable Program Reasoning through Learning and Formal Feedback'
SITE = 'https://www.wj2ai.com'


def validate_source():
    source = SOURCE.read_text(encoding='utf-8')
    if source.count('<!-- pagebreak -->') != 1:
        raise ValueError('The statement must contain exactly one explicit page break')
    required = [
        'Loop-R1', 'Defects4C', 'execution-trace study', 'RATCHET',
        'Research direction', 'Research basis', 'Initial programme',
    ]
    missing = [item for item in required if item not in source]
    if missing:
        raise ValueError(f'Missing required statement content: {missing}')
    return source


def inline(text):
    escaped = html.escape(text)
    escaped = re.sub(
        r'\[([^\]]+)\]\((/[^)]+|https?://[^)]+)\)',
        lambda match: f'<a href="{match[2] if match[2].startswith("http") else SITE + match[2]}" color="#276078">{match[1]}</a>',
        escaped,
    )
    escaped = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', escaped)
    return re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<i>\1</i>', escaped)


def build(font_dir, output):
    from pypdf import PdfReader
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.lib.units import mm
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate

    for family in ['Serif', 'Sans']:
        for suffix, style in [('Regular', ''), ('Bold', '-Bold'), ('Italic', '-Italic'), ('BoldItalic', '-BoldItalic')]:
            pdfmetrics.registerFont(TTFont(f'Lib{family}{style}', str(font_dir / f'Liberation{family}-{suffix}.ttf')))
        pdfmetrics.registerFontFamily(
            f'Lib{family}',
            normal=f'Lib{family}', bold=f'Lib{family}-Bold',
            italic=f'Lib{family}-Italic', boldItalic=f'Lib{family}-BoldItalic',
        )

    navy = colors.HexColor('#1f3b4d')
    muted = colors.HexColor('#5d6e77')
    styles = {
        'title': ParagraphStyle('Title', fontName='LibSerif-Bold', fontSize=18.5, leading=22, textColor=navy, spaceAfter=7, keepWithNext=True),
        'byline': ParagraphStyle('Byline', fontName='LibSans', fontSize=8.5, leading=11, textColor=muted, spaceAfter=11, keepWithNext=True),
        'h2': ParagraphStyle('H2', fontName='LibSerif-Bold', fontSize=12.5, leading=15, textColor=navy, spaceBefore=5, spaceAfter=6, keepWithNext=True),
        'body': ParagraphStyle('Body', fontName='LibSerif', fontSize=9.4, leading=12.2, textColor=colors.HexColor('#20292e'), spaceAfter=6.2),
    }

    story = [
        Paragraph(TITLE, styles['title']),
        Paragraph('Jian Wang, PhD · Research statement for Program Reasoning · September 2026', styles['byline']),
    ]
    blocks = re.split(r'\n\s*\n', validate_source().strip())
    for block in blocks:
        block = block.strip()
        if not block:
            continue
        if block == '<!-- pagebreak -->':
            story.append(PageBreak())
            story.append(Paragraph(TITLE.upper(), ParagraphStyle(
                'RunningTitle', parent=styles['byline'], fontSize=7.5, leading=9,
                textColor=muted, spaceAfter=8,
            )))
            continue
        heading = re.fullmatch(r'## (.+)', block)
        if heading:
            story.append(Paragraph(inline(heading[1]), styles['h2']))
            continue
        story.append(Paragraph(inline(' '.join(block.splitlines())), styles['body']))

    def page_furniture(canvas, doc):
        canvas.saveState()
        canvas.setStrokeColor(colors.HexColor('#d9e2e6'))
        canvas.setLineWidth(0.45)
        canvas.line(18 * mm, 15 * mm, A4[0] - 18 * mm, 15 * mm)
        canvas.setFont('LibSans', 7.5)
        canvas.setFillColor(muted)
        canvas.drawString(18 * mm, 10.5 * mm, 'Jian Wang · Program Reasoning Research Statement')
        canvas.drawRightString(A4[0] - 18 * mm, 10.5 * mm, str(doc.page))
        canvas.restoreState()

    output.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(output), pagesize=A4,
        leftMargin=18 * mm, rightMargin=18 * mm,
        topMargin=16 * mm, bottomMargin=19 * mm,
        title=TITLE, author='Jian Wang',
        subject='Learning and formal feedback for reliable program reasoning',
    )
    doc.build(story, onFirstPage=page_furniture, onLaterPages=page_furniture)
    pages = len(PdfReader(output).pages)
    if pages != 2:
        output.unlink(missing_ok=True)
        raise RuntimeError(f'Expected exactly 2 pages, produced {pages}')
    print(f'Wrote {output}: {pages} pages')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--font-dir', type=Path)
    parser.add_argument('--output', type=Path, default=OUTPUT)
    args = parser.parse_args()
    validate_source()
    if args.check:
        print(f'{TITLE}: source is ready for a two-page build')
        return
    if args.font_dir is None:
        parser.error('--font-dir is required unless --check is used')
    build(args.font_dir, args.output)


if __name__ == '__main__':
    main()
