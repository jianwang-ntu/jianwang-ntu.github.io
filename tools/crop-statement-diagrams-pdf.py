"""Crop a vector PDF exported from the shared PowerPoint canvas to each original.

Usage: python tools/crop-statement-diagrams-pdf.py INPUT.pdf OUTPUT.pdf
Requires pypdf. Text, vector paths and the original role crops are preserved.
"""
import argparse
from pathlib import Path
from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path)
parser.add_argument('output', type=Path)
args = parser.parse_args()
reader = PdfReader(args.source)
dimensions = [(1448, 1086), (1870, 841), (1870, 841), (1881, 836)]
if len(reader.pages) != len(dimensions):
    raise ValueError('Expected four diagram pages')
writer = PdfWriter()
for page, (width, height) in zip(reader.pages, dimensions):
    scale_x = float(page.mediabox.width) / 1881
    scale_y = float(page.mediabox.height) / 1086
    if abs(scale_x - scale_y) > .0001:
        raise ValueError('Expected the unchanged 1881 × 1086 PowerPoint canvas')
    left = float(page.mediabox.left) + (1881 - width) / 2 * scale_x
    bottom = float(page.mediabox.bottom) + (1086 - height) / 2 * scale_y
    rect = RectangleObject([left, bottom, left + width * scale_x, bottom + height * scale_y])
    page.mediabox = rect
    page.cropbox = rect
    writer.add_page(page)
writer.add_metadata({'/Title': 'Research statement diagrams: original layouts', '/Author': 'Jian Wang'})
args.output.parent.mkdir(parents=True, exist_ok=True)
with args.output.open('wb') as stream:
    writer.write(stream)
print(f'Wrote {args.output}: four original-size pages')
