#!/usr/bin/env python3
"""Create two-page teacher cards in A4 and US Letter, plus A4 PNG previews.

Requires reportlab and the pdftoppm command from Poppler. This is a standalone
asset tool, not part of the site's normal build. Print each PDF single-sided at
100% / Actual Size. No folding, cutting, or two-sided alignment is required.

Example:
    python3 scripts/generate-printable-cards.py --output-dir assets/printables
"""

import argparse
import math
from pathlib import Path
import shutil
import subprocess

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, letter
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
MARGIN = 43.2  # 0.6 inch; all ink stays inside the 0.5-inch printer-safe area.
INK = colors.black
QUIET = colors.Color(0.36, 0.36, 0.36)


def label(pdf, text, x, y, size=9, centered=False):
    pdf.setFillColor(QUIET)
    pdf.setFont("Helvetica", size)
    if centered:
        pdf.drawCentredString(x, y, text)
    else:
        pdf.drawString(x, y, text)


def frame(pdf, width, height):
    pdf.setStrokeColor(INK)
    pdf.setLineWidth(0.8)
    pdf.roundRect(MARGIN, MARGIN, width - 2 * MARGIN, height - 2 * MARGIN, 12)
    label(pdf, "quickgetwell.com", width / 2, MARGIN + 14, size=8, centered=True)


def writing_rule(pdf, x1, x2, y):
    pdf.setStrokeColor(QUIET)
    pdf.setLineWidth(0.65)
    pdf.line(x1, y, x2, y)


def sun(pdf, cx, cy, radius=39):
    """Original outline sun with a simple, open expression."""
    pdf.saveState()
    pdf.setStrokeColor(INK)
    pdf.setLineWidth(1.65)
    pdf.setLineCap(1)
    pdf.circle(cx, cy, radius, stroke=1, fill=0)
    for index in range(12):
        angle = index * math.pi / 6
        inner = radius + 12
        outer = radius + 25
        pdf.line(cx + math.cos(angle) * inner, cy + math.sin(angle) * inner,
                 cx + math.cos(angle) * outer, cy + math.sin(angle) * outer)
    pdf.setLineWidth(1.3)
    pdf.arc(cx - 15, cy - 11, cx + 15, cy + 8, startAng=200, extent=140)
    pdf.circle(cx - 12, cy + 9, 1.8, stroke=1, fill=0)
    pdf.circle(cx + 12, cy + 9, 1.8, stroke=1, fill=0)
    pdf.restoreState()


def leaf(pdf, x, y, direction):
    path = pdf.beginPath()
    path.moveTo(x, y)
    path.curveTo(x + direction * 9, y + 27, x + direction * 38, y + 32,
                 x + direction * 43, y + 24)
    path.curveTo(x + direction * 41, y + 8, x + direction * 18, y - 1, x, y)
    pdf.drawPath(path, stroke=1, fill=0)


def flower(pdf, cx, cy):
    """Original eight-petal flower, with wide shapes suitable for coloring."""
    pdf.saveState()
    pdf.setStrokeColor(INK)
    pdf.setLineWidth(1.65)
    pdf.setLineJoin(1)
    pdf.line(cx, cy - 65, cx, cy - 137)
    leaf(pdf, cx, cy - 129, -1)
    leaf(pdf, cx, cy - 108, 1)
    # Rotated teardrop petals meet the center without overlapping each other.
    for index in range(8):
        pdf.saveState()
        pdf.translate(cx, cy)
        pdf.rotate(index * 45)
        path = pdf.beginPath()
        path.moveTo(-7.6, 18.5)
        path.curveTo(-20, 42, -19, 65, 0, 65)
        path.curveTo(19, 65, 20, 42, 7.6, 18.5)
        pdf.drawPath(path, stroke=1, fill=0)
        pdf.restoreState()
    pdf.circle(cx, cy, 20, stroke=1, fill=0)
    pdf.restoreState()


def coloring_card(pdf, width, height):
    frame(pdf, width, height)
    center = width / 2
    left, right = MARGIN + 24, width - MARGIN - 24
    label(pdf, "A LITTLE NOTE FOR OUR TEACHER", center, height - 79, centered=True)
    pdf.setFillColor(INK)
    pdf.setFont("Times-Roman", 36)
    pdf.drawCentredString(center, height - 123, "A little sunshine")
    pdf.setFont("Helvetica", 12)
    pdf.drawCentredString(center, height - 147, "for a teacher we care about.")
    pdf.setFont("Helvetica", 12)
    pdf.drawString(left, height - 186, "Dear")
    writing_rule(pdf, left + 36, right, height - 190)

    sun(pdf, width * 0.31, height - 282)
    flower(pdf, width * 0.66, height - 282)

    pdf.setFillColor(INK)
    pdf.setFont("Times-Italic", 15.5)
    pdf.drawCentredString(center, height - 461, "Thinking of you and sending warm wishes.")
    for offset in [500, 539, 578]:
        writing_rule(pdf, left, right, height - offset)

    pdf.setFillColor(INK)
    pdf.setFont("Helvetica", 11)
    pdf.drawString(left, MARGIN + 86, "From")
    writing_rule(pdf, left + 39, right, MARGIN + 82)
    label(pdf, "Your name or class", left + 39, MARGIN + 67, size=8)
    pdf.showPage()


def class_card(pdf, width, height):
    frame(pdf, width, height)
    center = width / 2
    left, right = MARGIN + 24, width - MARGIN - 24
    label(pdf, "FROM ALL OF US", center, height - 79, centered=True)
    pdf.setFillColor(INK)
    pdf.setFont("Times-Roman", 30)
    pdf.drawCentredString(center, height - 123, "Our class is thinking of you.")
    pdf.setFont("Helvetica", 11.3)
    pdf.drawCentredString(center, height - 149,
                         "Sending warm wishes, kind thoughts, and a little cheer.")
    pdf.setFont("Helvetica", 11)
    pdf.drawString(left, height - 188, "Dear")
    writing_rule(pdf, left + 36, right, height - 192)
    pdf.setFillColor(INK)
    pdf.drawString(left, height - 222, "From")
    writing_rule(pdf, left + 39, right, height - 226)
    label(pdf, "Our class", left + 39, height - 239, size=8)

    label(pdf, "A name or a little drawing from each of us", left, height - 268, size=9)
    columns, rows, gap = 4, 6, 8
    grid_top, grid_bottom = height - 282, MARGIN + 53
    box_width = (right - left - (columns - 1) * gap) / columns
    box_height = (grid_top - grid_bottom - (rows - 1) * gap) / rows
    pdf.setStrokeColor(QUIET)
    pdf.setLineWidth(0.65)
    for row in range(rows):
        for column in range(columns):
            x = left + column * (box_width + gap)
            y = grid_top - (row + 1) * box_height - row * gap
            pdf.roundRect(x, y, box_width, box_height, 5, stroke=1, fill=0)
            label(pdf, str(row * columns + column + 1), x + 7, y + box_height - 13, size=7)
    pdf.showPage()


def create_pdf(destination, size, size_name):
    pdf = canvas.Canvas(str(destination), pagesize=size, pageCompression=1, invariant=1)
    pdf.setTitle(f"Teacher get-well cards - {size_name}")
    pdf.setAuthor("Quick Get Well")
    pdf.setSubject("Two single-sided teacher cards. Print at 100% / Actual Size. No folding required.")
    coloring_card(pdf, *size)
    class_card(pdf, *size)
    pdf.save()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, default=ROOT / "output" / "pdf")
    args = parser.parse_args()
    renderer = shutil.which("pdftoppm")
    if not renderer:
        parser.error("pdftoppm (Poppler) is required to create page previews.")
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for suffix, size, name in [("a4", A4, "A4"), ("letter", letter, "US Letter")]:
        destination = args.output_dir / f"teacher-get-well-cards-{suffix}-v1.pdf"
        create_pdf(destination, size, name)
        print(destination.resolve())
    a4_pdf = args.output_dir / "teacher-get-well-cards-a4-v1.pdf"
    for page, name in [(1, "teacher-card-coloring-preview"), (2, "teacher-card-class-preview")]:
        destination = args.output_dir / name
        subprocess.run([renderer, "-f", str(page), "-l", str(page), "-singlefile",
                        "-scale-to-x", "480", "-scale-to-y", "-1", "-png",
                        str(a4_pdf), str(destination)], check=True)
        print(destination.with_suffix(".png").resolve())


if __name__ == "__main__":
    main()
