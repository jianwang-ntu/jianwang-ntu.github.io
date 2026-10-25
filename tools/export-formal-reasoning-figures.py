#!/usr/bin/env python3
"""Export website figures from the checked PowerPoint PDF, using Poppler + Pillow."""
from hashlib import sha256
from pathlib import Path
from subprocess import run
from tempfile import TemporaryDirectory
from zipfile import ZipFile, ZIP_DEFLATED
import json

from PIL import Image
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'public/data/formal-reasoning-diagrams'
PDF = DATA / 'formal-reasoning-diagrams.pdf'
FIGURES = ROOT / 'public/figures/formal-reasoning'
NAMES = ['overview', 'learning-proof-strategies',
         'compositional-verification', 'trustworthy-feedback']


def digest(path):
    return sha256(path.read_bytes()).hexdigest()


pages = PdfReader(PDF).pages
assert len(pages) == len(NAMES), 'Expected four diagram pages'
for page in pages:
    assert 'Anthropic' not in page.extract_text(), 'Keep source citations in HTML captions'
manifest = {
    'source_pdf': '/data/formal-reasoning-diagrams/formal-reasoning-diagrams.pdf',
    'source_pdf_sha256': digest(PDF),
    'editable_pptx_sha256': digest(DATA / 'formal-reasoning-diagrams.pptx'),
    'canvas': {'width': 1672, 'height': 941},
    'citations': 'HTML figure captions and PowerPoint speaker notes',
    'figures': [],
}
with TemporaryDirectory(prefix='formal-pdf-export-') as temp:
    for page, name in enumerate(NAMES, 1):
        svg = FIGURES / f'{name}.svg'
        # SVG preserves paths from the PDF instead of embedding a screenshot.
        run(['pdftocairo', '-svg', '-f', str(page), '-l', str(page),
             str(PDF), str(svg)], check=True)
        content = svg.read_text()
        assert '<svg' in content and '<image' not in content
        assert '<script' not in content
        prefix = Path(temp) / name
        # 192 dpi = two output pixels per original 96-dpi slide pixel.
        run(['pdftoppm', '-f', str(page), '-l', str(page), '-singlefile',
             '-r', '192', '-png', str(PDF), str(prefix)], check=True)
        png = FIGURES / f'{name}.png'
        png.write_bytes(prefix.with_suffix('.png').read_bytes())
        with Image.open(png) as image:
            assert image.size == (3344, 1882), image.size
            image.save(FIGURES / f'{name}.webp', lossless=True, method=6)
        manifest['figures'].append({
            'name': name, 'pdf_page': page,
            'files': {ext: digest(FIGURES / f'{name}.{ext}')
                      for ext in ['svg', 'png', 'webp']},
        })
(FIGURES / 'exports.json').write_text(json.dumps(manifest, indent=2) + '\n')

with ZipFile(ROOT / 'public/data/formal-reasoning-diagrams.zip',
             'w', ZIP_DEFLATED) as bundle:
    for name in NAMES:
        for ext in ['svg', 'png']:
            bundle.write(FIGURES / f'{name}.{ext}', f'{name}.{ext}')
    for ext in ['pptx', 'pdf']:
        bundle.write(DATA / f'formal-reasoning-diagrams.{ext}',
                     f'formal-reasoning-diagrams.{ext}')
    bundle.write(FIGURES / 'exports.json', 'exports.json')
    bundle.writestr('README.txt', (DATA / 'README.md').read_text())
print('Exported four vector SVGs, 2× PNG/WebP previews, and the download bundle')
