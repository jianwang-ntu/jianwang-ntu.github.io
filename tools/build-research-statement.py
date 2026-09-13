#!/usr/bin/env python3
"""Build the Reliable Autonomy research statement PDF from Markdown and PNG.

The checked-in PDF is the published artifact; this authoring tool is not part
of the npm build. Use --check for a dependency-free source validation.
"""
import argparse
import html
from io import BytesIO
from pathlib import Path
import re
import tempfile


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'src/content/research-statement-full.md'
OVERVIEW = ROOT / 'public/images/research/reliable-autonomy-overview.png'
TITLE = 'Reliable Autonomy for Adaptive AI Agents'
AREAS = [
    ('Research statement: I. Scalable oversight under adaptation', (65, 205, 505, 445)),
    ('Research statement: II. Safety-preserving learning and feedback', (930, 185, 470, 465)),
    ('Research statement: III. Control across time and delegation', (450, 650, 545, 365)),
]


def validate_source():
    source = SOURCE.read_text(encoding='utf-8')
    if not source.startswith(f'# {TITLE}\n'):
        raise ValueError(f'Expected statement title: {TITLE}')
    if '```mermaid' not in source:
        raise ValueError('Expected the source Mermaid block that the PNG overview replaces')
    headings = re.findall(r'^## (.+)$', source, flags=re.MULTILINE)
    missing = [heading for heading, _ in AREAS if heading not in headings]
    if missing:
        raise ValueError(f'Missing linked sections: {missing}')
    if OVERVIEW.read_bytes()[:8] != b'\x89PNG\r\n\x1a\n':
        raise ValueError(f'Invalid PNG overview: {OVERVIEW}')
    return source, headings


def plain_heading(text):
    return re.sub(r'[*_`]', '', text).strip()


def inline(text):
    text = text.replace('<br>', '\n').replace('<br/>', '\n').replace('<br />', '\n')
    text = html.escape(text)
    text = text.replace('\n', '<br/>')
    text = re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)', r'<a href="\2" color="#246880">\1</a>', text)
    text = re.sub(r'`([^`]+)`', r'<font name="LibSans" size="8">\1</font>', text)
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    return re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<i>\1</i>', text)


def build(font_dir, output):
    from pypdf import PdfReader, PdfWriter
    from pypdf.annotations import Link
    from pypdf.generic import Fit
    from reportlab.lib import colors
    from reportlab.lib.enums import TA_LEFT
    from reportlab.lib.pagesizes import A4, landscape
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.lib.utils import ImageReader
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.pdfgen import canvas
    from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Table, TableStyle

    blue = colors.HexColor('#19394f')
    link_color = colors.HexColor('#246880')
    source, source_headings = validate_source()

    for family in ['Serif', 'Sans']:
        for suffix, style in [('Regular', ''), ('Bold', '-Bold'), ('Italic', '-Italic'), ('BoldItalic', '-BoldItalic')]:
            pdfmetrics.registerFont(TTFont(f'Lib{family}{style}', str(font_dir / f'Liberation{family}-{suffix}.ttf')))
        pdfmetrics.registerFontFamily(
            f'Lib{family}',
            normal=f'Lib{family}',
            bold=f'Lib{family}-Bold',
            italic=f'Lib{family}-Italic',
            boldItalic=f'Lib{family}-BoldItalic',
        )

    styles = {
        'body': ParagraphStyle('Body', fontName='LibSerif', fontSize=11, leading=14.4, spaceAfter=7),
        'title': ParagraphStyle('Title', fontName='LibSerif-Bold', fontSize=22, leading=27, textColor=blue, spaceAfter=9, keepWithNext=True),
        'byline': ParagraphStyle('Byline', fontName='LibSans', fontSize=9.5, leading=13, textColor=colors.HexColor('#586d79'), spaceAfter=8, keepWithNext=True),
        'subtitle': ParagraphStyle('Subtitle', fontName='LibSerif', fontSize=13, leading=17, textColor=link_color, spaceAfter=14, keepWithNext=True),
        'h2': ParagraphStyle('H2', fontName='LibSerif-Bold', fontSize=15.5, leading=19, textColor=blue, spaceAfter=9, keepWithNext=True),
        'h3': ParagraphStyle('H3', fontName='LibSerif-Bold', fontSize=11.4, leading=14.5, textColor=blue, spaceBefore=5, spaceAfter=5, keepWithNext=True),
        'quote': ParagraphStyle('Quote', fontName='LibSerif-Italic', fontSize=9.2, leading=12, leftIndent=14, borderColor=colors.HexColor('#b9ccd5'), borderWidth=1.5, borderPadding=7, spaceAfter=8),
        'table': ParagraphStyle('Table', fontName='LibSerif', fontSize=8.2, leading=10.4, alignment=TA_LEFT),
        'reference': ParagraphStyle('Reference', fontName='LibSerif', fontSize=8.8, leading=11.3, spaceAfter=6),
    }

    class StatementDoc(SimpleDocTemplate):
        def afterFlowable(self, flowable):
            if hasattr(flowable, 'heading'):
                self.headings[flowable.heading.casefold()] = (self.page, self.frame._y + flowable.height + 16)

    body_source = re.sub(r'```mermaid\s*.*?```', '', source, flags=re.DOTALL)
    story = []
    for block in re.split(r'\n\s*\n', body_source.strip()):
        block = block.strip()
        if not block:
            continue
        if block == '---':
            if story and not isinstance(story[-1], PageBreak):
                story.append(PageBreak())
            continue
        heading = re.fullmatch(r'(#{1,3}) (.+)', block)
        if heading:
            level, title = len(heading[1]), plain_heading(heading[2])
            key = 'title' if level == 1 else 'h2' if level == 2 else 'h3'
            paragraph = Paragraph(inline(title.removeprefix('Research statement: ')), styles[key])
            paragraph.heading = title
            story.append(paragraph)
            continue
        if block.startswith('|'):
            rows = [[cell.strip() for cell in line.strip().strip('|').split('|')] for line in block.splitlines()]
            rows = [row for row in rows if not all(re.fullmatch(r'[\s:-]+', cell) for cell in row)]
            if not rows:
                continue
            cells = [[Paragraph(inline(cell), styles['table']) for cell in row] for row in rows]
            available = A4[0] - 98
            widths = [available * 0.34, available * 0.66] if len(rows[0]) == 2 else [available / len(rows[0])] * len(rows[0])
            table = Table(cells, colWidths=widths, repeatRows=1, hAlign='LEFT')
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#eef4f7')),
                ('LINEABOVE', (0, 0), (-1, 0), .7, link_color),
                ('LINEBELOW', (0, 0), (-1, -1), .3, colors.HexColor('#dce5ea')),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('LEFTPADDING', (0, 0), (-1, -1), 6),
                ('RIGHTPADDING', (0, 0), (-1, -1), 6),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ]))
            table.spaceAfter = 10
            story.append(table)
            continue
        if block.startswith('>'):
            quoted = ' '.join(line.removeprefix('>').strip() for line in block.splitlines())
            story.append(Paragraph(inline(quoted), styles['quote']))
            continue
        if block.startswith('- '):
            for line in block.splitlines():
                story.append(Paragraph(inline(line[2:]), styles['reference'], bulletText='•'))
            continue

        normalized = ' '.join(block.splitlines())
        if re.match(r'^\*Figure 1\.', normalized):
            continue
        if normalized.startswith('**Jian Wang |'):
            story.append(Paragraph(inline(normalized), styles['byline']))
        elif normalized == 'Scalable oversight, safety-preserving learning, and secure delegation':
            story.append(Paragraph(inline(normalized), styles['subtitle']))
        else:
            style = styles['reference'] if re.match(r'^\[\d+\] ', normalized) else styles['body']
            story.append(Paragraph(inline(normalized), style))

    def furniture(c, doc):
        c.setFont('LibSans', 7.8)
        c.setFillColor(colors.HexColor('#586d79'))
        if doc.page > 1:
            c.drawString(49, A4[1] - 30, 'RELIABLE AUTONOMY FOR ADAPTIVE AI AGENTS')
            c.drawRightString(A4[0] - 49, A4[1] - 30, 'Jian Wang | Research Statement')
        c.drawString(49, 27, 'Proposed research | 13 September 2026')
        c.drawRightString(A4[0] - 49, 27, str(doc.page))

    with tempfile.TemporaryDirectory() as temp:
        body_path = Path(temp) / 'body.pdf'
        doc = StatementDoc(
            str(body_path),
            pagesize=A4,
            leftMargin=49,
            rightMargin=49,
            topMargin=55,
            bottomMargin=48,
            title=TITLE,
            author='Jian Wang',
            subject='Scalable oversight, safety-preserving learning, and secure delegation',
        )
        doc.headings = {}
        doc.build(story, onFirstPage=furniture, onLaterPages=furniture)

        body = PdfReader(body_path)
        width, height = landscape(A4)
        image_width, image_height = 1448, 1086
        max_width, max_height = width - 68, height - 76
        scale = min(max_width / image_width, max_height / image_height)
        art_width, art_height = image_width * scale, image_height * scale
        left, bottom = (width - art_width) / 2, (height - art_height) / 2 + 8
        cover_buffer = BytesIO()
        c = canvas.Canvas(cover_buffer, pagesize=(width, height))
        c.drawImage(ImageReader(str(OVERVIEW)), left, bottom, width=art_width, height=art_height, preserveAspectRatio=True, mask='auto')
        c.setFont('LibSans', 8.5)
        c.setFillColor(colors.HexColor('#586d79'))
        c.drawCentredString(width / 2, 24, 'Select a research area to read the corresponding section.')
        c.showPage()
        c.save()

        writer = PdfWriter()
        writer.add_page(PdfReader(cover_buffer).pages[0])
        writer.append(body)
        writer.add_metadata(dict(body.metadata))
        for label, (x, y, box_width, box_height) in AREAS:
            page, top = doc.headings[label.casefold()]
            rect = (
                left + x * scale,
                bottom + (image_height - y - box_height) * scale,
                left + (x + box_width) * scale,
                bottom + (image_height - y) * scale,
            )
            writer.add_annotation(0, Link(rect=rect, target_page_index=page, fit=Fit.xyz(left=0, top=top, zoom=0)))

        writer.add_outline_item('Research overview', 0)
        for title in [TITLE, *source_headings]:
            page, top = doc.headings[title.casefold()]
            writer.add_outline_item(title.replace('Research statement: ', ''), page, fit=Fit.xyz(left=0, top=top, zoom=0))
        writer.set_page_label(0, 0, prefix='Overview')
        writer.set_page_label(1, len(body.pages), style='/D', start=1)
        for page in writer.pages:
            page.compress_content_streams()
        output.parent.mkdir(parents=True, exist_ok=True)
        with output.open('wb') as stream:
            writer.write(stream)

    print(f'Wrote {output}: {len(body.pages) + 1} pages, {len(AREAS)} overview links')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='validate source and overview without authoring a PDF')
    parser.add_argument('--font-dir', type=Path)
    parser.add_argument('--output', type=Path, default=ROOT / 'public/data/Jian_Wang_Research_Statement_2026.pdf')
    args = parser.parse_args()
    _, headings = validate_source()
    if args.check:
        print(f'{TITLE}: {len(AREAS)} overview links, {len(headings)} top-level sections')
        return
    if args.font_dir is None:
        parser.error('--font-dir is required unless --check is used')
    build(args.font_dir, args.output)


if __name__ == '__main__':
    main()
