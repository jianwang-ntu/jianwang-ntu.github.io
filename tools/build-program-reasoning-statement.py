#!/usr/bin/env python3
"""Build the two-page Program Reasoning research statement from Markdown."""

import argparse
import html
from pathlib import Path
import re
from xml.etree import ElementTree


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'src/content/program-reasoning-statement.md'
OVERVIEW = ROOT / 'public/figures/program-reasoning-overview.svg'
OUTPUT = ROOT / 'public/data/Jian_Wang_Program_Reasoning_Statement_2026.pdf'
TITLE = 'Learning and Formal Reasoning for Program Understanding, Verification, and Synthesis'
SITE = 'https://www.wj2ai.com'


def validate_source():
    source = SOURCE.read_text(encoding='utf-8')
    if source.count('<!-- pagebreak -->') != 1:
        raise ValueError('The statement must contain exactly one explicit page break')
    required = [
        'Loop-R1', 'Defects4C', 'execution-trace study', 'RATCHET',
        'Research problem', 'Proposed research', 'Evidence from prior work',
        'Fit and contribution',
    ]
    missing = [item for item in required if item not in source]
    if missing:
        raise ValueError(f'Missing required statement content: {missing}')
    if not OVERVIEW.exists():
        raise ValueError('The program-reasoning overview SVG is missing')
    overview_text()
    return source


def overview_text():
    """Read the PDF figure copy from the website SVG to keep both versions aligned."""
    required = [
        'problem-kicker', 'problem-title', 'problem-line-1', 'problem-line-2',
        'method-kicker', 'method-title', 'method-line-1', 'method-line-2',
        'method-feedback', 'outputs-kicker', 'outputs-title',
        'outputs-line-1', 'outputs-line-2',
    ]
    root = ElementTree.parse(OVERVIEW).getroot()
    copy = {
        element.attrib['id']: ''.join(element.itertext()).strip()
        for element in root.iter()
        if element.attrib.get('id') in required
    }
    missing = [item for item in required if not copy.get(item)]
    if missing:
        raise ValueError(f'Missing overview SVG copy: {missing}')
    return copy


def overview_drawing(width, fonts):
    """Mirror the website overview as a compact vector figure in the PDF."""
    from reportlab.graphics.shapes import Drawing, Line, Polygon, Rect, String
    from reportlab.lib import colors

    height = 108
    drawing = Drawing(width, height)
    navy = colors.HexColor('#1f3b4d')
    blue = colors.HexColor('#52798a')
    green = colors.HexColor('#7d9e75')
    border = colors.HexColor('#9db5c0')
    muted = colors.HexColor('#526772')
    copy = overview_text()

    def box(x, y, box_width, box_height, fill, kicker, title, lines):
        drawing.add(Rect(x, y, box_width, box_height, rx=5, ry=5, fillColor=fill, strokeColor=border, strokeWidth=0.8))
        drawing.add(String(x + 10, y + box_height - 14, kicker, fontName=fonts['sans_bold'], fontSize=5.5, fillColor=blue))
        drawing.add(String(x + 10, y + box_height - 29, title, fontName=fonts['sans_bold'], fontSize=8.3, fillColor=navy))
        for index, line in enumerate(lines):
            drawing.add(String(x + 10, y + box_height - 44 - index * 10, line, fontName=fonts['sans'], fontSize=6.2, fillColor=muted))

    def arrow(start, end, y):
        drawing.add(Line(start, y, end - 4, y, strokeColor=blue, strokeWidth=1.2))
        drawing.add(Polygon([end - 4, y - 3, end, y, end - 4, y + 3], fillColor=blue, strokeColor=blue))

    left_x, left_width = 4, 139
    middle_x, middle_width = 163, 164
    right_x, right_width = 347, 139
    box(left_x, 21, left_width, 66, colors.white, copy['problem-kicker'], copy['problem-title'], [
        copy['problem-line-1'],
        copy['problem-line-2'],
    ])
    box(middle_x, 10, middle_width, 88, colors.HexColor('#eef5f7'), copy['method-kicker'], copy['method-title'], [
        copy['method-line-1'],
        copy['method-line-2'],
    ])
    drawing.add(Line(middle_x + 26, 29, middle_x + 131, 29, strokeColor=green, strokeWidth=1.1))
    drawing.add(Polygon([middle_x + 26, 26, middle_x + 20, 29, middle_x + 26, 32], fillColor=green, strokeColor=green))
    drawing.add(String(middle_x + 32, 18, copy['method-feedback'], fontName=fonts['sans'], fontSize=5.8, fillColor=green))
    box(right_x, 21, right_width, 66, colors.white, copy['outputs-kicker'], copy['outputs-title'], [
        copy['outputs-line-1'],
        copy['outputs-line-2'],
    ])
    arrow(left_x + left_width, middle_x, 54)
    arrow(middle_x + middle_width, right_x, 54)
    return drawing


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
    from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer

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
        'h2': ParagraphStyle('H2', fontName='LibSerif-Bold', fontSize=13.5, leading=16, textColor=navy, spaceBefore=6, spaceAfter=7, keepWithNext=True),
        'body': ParagraphStyle('Body', fontName='LibSerif', fontSize=10.2, leading=13.5, textColor=colors.HexColor('#20292e'), spaceAfter=7),
    }

    story = [
        Paragraph(TITLE, styles['title']),
        Paragraph('Jian Wang, PhD · Research statement for Program Reasoning · September 2026', styles['byline']),
        overview_drawing(174 * mm, {'sans': 'LibSans', 'sans_bold': 'LibSans-Bold'}),
        Spacer(1, 5),
    ]
    blocks = re.split(r'\n\s*\n', validate_source().strip())
    for block in blocks:
        block = block.strip()
        if not block:
            continue
        if block == '<!-- pagebreak -->':
            story.append(PageBreak())
            story.append(Paragraph('PROGRAM REASONING RESEARCH STATEMENT', ParagraphStyle(
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
