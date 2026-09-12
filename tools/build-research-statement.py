#!/usr/bin/env python3
"""Build the full statement PDF from its Markdown source and linked SVG overview.

Requires reportlab, pypdf, cairosvg (and the Cairo system library).
Pass --font-dir with a directory containing the Liberation Serif/Sans TTF files.
The site serves the checked-in PDF; this authoring tool is not part of npm build.
"""
import argparse
import html
from io import BytesIO
from pathlib import Path
import re
import tempfile

import cairosvg
from pypdf import PdfReader, PdfWriter, Transformation
from pypdf.annotations import Link
from pypdf.generic import Fit
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, PageBreak, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
BLUE = colors.HexColor('#19394f')
LINK = colors.HexColor('#246880')


def inline(text):
    text = html.escape(text)
    text = re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)', r'<a href="\2" color="#246880">\1</a>', text)
    text = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', text)
    return re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<i>\1</i>', text)


class StatementDoc(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if hasattr(flowable, 'heading'):
            self.headings[flowable.heading.casefold()] = (self.page, self.frame._y + flowable.height + 16)


def build(font_dir, output):
    for family in ['Serif', 'Sans']:
        for suffix, style in [('Regular', ''), ('Bold', '-Bold'), ('Italic', '-Italic'), ('BoldItalic', '-BoldItalic')]:
            pdfmetrics.registerFont(TTFont(f'Lib{family}{style}', str(font_dir / f'Liberation{family}-{suffix}.ttf')))
        pdfmetrics.registerFontFamily(f'Lib{family}', normal=f'Lib{family}', bold=f'Lib{family}-Bold',
                                      italic=f'Lib{family}-Italic', boldItalic=f'Lib{family}-BoldItalic')
    styles = {
        'body': ParagraphStyle('Body', fontName='LibSerif', fontSize=10.2, leading=12.6, spaceAfter=6),
        'title': ParagraphStyle('Title', fontName='LibSerif-Bold', fontSize=22, leading=26, textColor=BLUE, spaceAfter=10, keepWithNext=True),
        'subtitle': ParagraphStyle('Subtitle', fontName='LibSerif', fontSize=13, leading=17, textColor=LINK, spaceAfter=10, keepWithNext=True),
        'h2': ParagraphStyle('H2', fontName='LibSerif-Bold', fontSize=16, leading=20, textColor=BLUE, spaceAfter=10, keepWithNext=True),
        'h3': ParagraphStyle('H3', fontName='LibSerif-Bold', fontSize=11.7, leading=15, textColor=BLUE, spaceBefore=5, spaceAfter=5, keepWithNext=True),
        'table': ParagraphStyle('Table', fontName='LibSerif', fontSize=9.5, leading=12, alignment=TA_LEFT),
        'reference': ParagraphStyle('Reference', fontName='LibSerif', fontSize=9.2, leading=11.8, spaceAfter=7),
    }
    source = (ROOT / 'src/content/research-statement-full.md').read_text()
    story = []
    for block in re.split(r'\n\s*\n', source.strip()):
        if block == '<!-- PAGEBREAK -->':
            story.append(PageBreak())
        elif block.startswith('#'):
            heading = re.match(r'(#{1,3}) (.+)', block)
            if not heading:
                raise ValueError(f'Unsupported heading: {block}')
            level, title = len(heading[1]), heading[2]
            key = 'title' if level == 1 else 'h3' if level == 3 else 'h2'
            if title.startswith('Research Statement:'):
                key = 'subtitle'
            paragraph = Paragraph(inline(title), styles[key])
            paragraph.heading = title
            story.append(paragraph)
        elif block.startswith('|'):
            rows = [line.strip().strip('|').split('|') for line in block.splitlines()]
            rows = [row for row in rows if not all(re.fullmatch(r'[\s:-]+', cell) for cell in row)]
            cells = [[Paragraph(inline(cell.strip()), styles['table']) for cell in row] for row in rows]
            widths = [110, 150, 225.2756] if len(rows[0]) == 3 else [88, 397.2756]
            table = Table(cells, colWidths=widths, repeatRows=1, hAlign='LEFT')
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#eef4f7')),
                ('LINEABOVE', (0, 0), (-1, 0), .7, LINK),
                ('LINEBELOW', (0, 0), (-1, -1), .3, colors.HexColor('#dce5ea')),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('LEFTPADDING', (0, 0), (-1, -1), 7), ('RIGHTPADDING', (0, 0), (-1, -1), 7),
                ('TOPPADDING', (0, 0), (-1, -1), 7), ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
            ]))
            table.spaceAfter = 10
            story.append(table)
        elif block.startswith('- '):
            for line in block.splitlines():
                story.append(Paragraph(inline(line[2:]), styles['reference'], bulletText='•'))
        else:
            style = styles['reference'] if re.match(r'^\d+\. ', block) else styles['body']
            story.append(Paragraph(inline(block.replace('\n', ' ')), style))

    def furniture(c, doc):
        c.setFont('LibSans', 7.8)
        c.setFillColor(colors.HexColor('#586d79'))
        if doc.page > 1:
            c.drawString(49, A4[1] - 30, 'TRUSTWORTHY AGENT NETWORKS')
            c.drawRightString(A4[0] - 49, A4[1] - 30, 'Jian Wang | Research Statement')
        c.drawString(49, 27, 'Proposed research | September 2026')
        c.drawRightString(A4[0] - 49, 27, str(doc.page))

    with tempfile.TemporaryDirectory() as temp:
        body_path = Path(temp) / 'body.pdf'
        doc = StatementDoc(str(body_path), pagesize=A4, leftMargin=49, rightMargin=49,
                           topMargin=55, bottomMargin=48, title='Trustworthy Agent Networks: Research Statement',
                           author='Jian Wang', subject='Assured Agency and Collective Agency, 2026-2029')
        doc.headings = {}
        doc.build(story, onFirstPage=furniture, onLaterPages=furniture)
        body = PdfReader(body_path)
        expected_pages = source.count('<!-- PAGEBREAK -->') + 1
        if len(body.pages) != expected_pages:
            raise ValueError('A planned section overflowed its page; review the text and layout before publishing.')
        art = PdfReader(BytesIO(cairosvg.svg2pdf(url=str(ROOT / 'src/assets/trustworthy_agent_networks.svg')))).pages[0]
        width, height = landscape(A4)
        left, art_width = 34, width - 68
        art_height = art_width * 940 / 1672
        bottom = (height - art_height) / 2 + 8
        cover_buffer = BytesIO()
        c = canvas.Canvas(cover_buffer, pagesize=(width, height))
        c.setFont('LibSans', 9)
        c.setFillColor(colors.HexColor('#586d79'))
        c.drawCentredString(width / 2, 34, 'Select a heading or topic box to read the corresponding section.')
        c.showPage()
        c.save()
        cover = PdfReader(cover_buffer).pages[0]
        cover.merge_transformed_page(art, Transformation().scale(art_width / float(art.mediabox.width)).translate(left, bottom))
        writer = PdfWriter()
        writer.add_page(cover)
        writer.append(body)
        writer.add_metadata(dict(body.metadata))
        regions = re.findall(r"label: '([^']+)', box: \[(\d+), (\d+), (\d+), (\d+)\]", (ROOT / 'src/components/ResearchOverview.jsx').read_text())
        if len(regions) != 12:
            raise ValueError('Expected 12 overview links')
        for label, x, y, w, h in regions:
            key = label.casefold()
            if key == 'assured agency': key = 'essay i. assured agency'
            if key == 'collective agency': key = 'essay ii. collective agency'
            page, top = doc.headings[key]
            x, y, w, h = map(float, (x, y, w, h))
            rect = (left + x * art_width / 1672, bottom + (940 - y - h) * art_height / 940,
                    left + (x + w) * art_width / 1672, bottom + (940 - y) * art_height / 940)
            writer.add_annotation(0, Link(rect=rect, target_page_index=page, fit=Fit.xyz(left=0, top=top, zoom=0)))
        writer.add_outline_item('Research overview', 0)
        for title in ['Trustworthy Agent Networks', 'Essay I. Assured Agency', 'Essay II. Collective Agency',
                      'Independent Evidence and Controlled Adaptation', 'Research Foundations', 'Published foundations']:
            page, top = doc.headings[title.casefold()]
            writer.add_outline_item(title, page, fit=Fit.xyz(left=0, top=top, zoom=0))
        writer.set_page_label(0, 0, prefix='Overview')
        writer.set_page_label(1, len(body.pages), style='/D', start=1)
        for page in writer.pages:
            page.compress_content_streams()
        output.parent.mkdir(parents=True, exist_ok=True)
        with output.open('wb') as stream:
            writer.write(stream)
    print(f'Wrote {output}: {len(body.pages) + 1} pages, 12 overview links')
    print('Sections:', doc.headings)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--font-dir', type=Path, required=True)
    parser.add_argument('--output', type=Path, default=ROOT / 'public/data/Jian_Wang_Research_Statement_202609.pdf')
    args = parser.parse_args()
    build(args.font_dir, args.output)
