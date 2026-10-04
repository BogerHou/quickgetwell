#!/usr/bin/env python3
"""Create a four-page teacher care pack without changing the original cards.

Outputs A4 and US Letter PDFs plus two 480px-wide A4 previews. The existing
card drawing functions are imported, not edited, and their pages are reused
between a new organizer guide and an extra sheet of 12 wide signature spaces.

Requires reportlab and Poppler's pdftoppm. PDF metadata is deterministic.
Example:
    python3 scripts/generate-teacher-care-pack.py \
        --output-dir output/pdf/teacher-care-pack
"""

import argparse
import importlib.util
from pathlib import Path
import shutil
import subprocess
import sys

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
sys.dont_write_bytecode = True
SPEC = importlib.util.spec_from_file_location(
    "original_teacher_cards", ROOT / "scripts" / "generate-printable-cards.py"
)
CARDS = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(CARDS)

BODY = ParagraphStyle(
    "body", fontName="Helvetica", fontSize=12, leading=16,
    textColor=colors.black, spaceAfter=0,
)
HEADING = ParagraphStyle(
    "heading", fontName="Helvetica-Bold", fontSize=13, leading=17,
    textColor=colors.black, spaceAfter=0,
)


def paragraph(pdf, text, x, top, width, style=BODY):
    block = Paragraph(text, style)
    _, height = block.wrap(width, 1000)
    block.drawOn(pdf, x, top - height)
    return top - height


def organizer_page(pdf, width, height):
    CARDS.frame(pdf, width, height)
    left, right = CARDS.MARGIN + 24, width - CARDS.MARGIN - 24
    span = right - left
    CARDS.label(pdf, "TEACHER CARE PACK / ORGANIZER", left, height - 79, size=9)
    pdf.setFillColor(colors.black)
    pdf.setFont("Times-Roman", 30)
    pdf.drawString(left, height - 119, "A class card, with care")
    top = paragraph(pdf, "A simple guide for the person organizing the card.",
                    left, height - 138, span) - 21

    top = paragraph(pdf, "1. Invite the class", left, top, span, HEADING) - 7
    top = paragraph(
        pdf,
        "Use your usual school channel to invite classmates. A name, a kind "
        "sentence or a little drawing is enough. Signing is optional; "
        "no one needs to explain if they pass.",
        left, top, span,
    ) - 19

    top = paragraph(pdf, "2. Keep the focus on care", left, top, span, HEADING) - 7
    top = paragraph(
        pdf,
        "Use the title and name students normally use. Leave out health "
        "questions, lesson requests and questions about returning to school. "
        "Respect any request for privacy or no messages. No reply is needed.",
        left, top, span,
    ) - 19

    top = paragraph(pdf, "An invitation you can adapt", left, top, span, HEADING) - 9
    invitation = (
        "We're putting together a card for [Teacher's name]. If you'd like to "
        "take part, please add a short note, your name, or a drawing by [day]. "
        "You do not need to write about their health. Taking part is optional. "
        "Please give your note to [organizer]."
    )
    block = Paragraph(invitation, BODY)
    _, block_height = block.wrap(span - 24, 1000)
    box_height = block_height + 24
    pdf.setStrokeColor(CARDS.QUIET)
    pdf.setLineWidth(0.65)
    pdf.roundRect(left, top - box_height, span, box_height, 6, stroke=1, fill=0)
    block.drawOn(pdf, left + 12, top - 12 - block_height)
    top -= box_height + 20

    top = paragraph(pdf, "3. Choose and print only what you need", left, top, span, HEADING) - 7
    top = paragraph(
        pdf,
        "<b>Page 2:</b> a coloring card with space for a personal note.<br/>"
        "<b>Page 3:</b> a class card with 24 spaces.<br/>"
        "<b>Page 4:</b> 12 wider spaces; print extra copies as needed. "
        "Leave unused boxes blank.",
        left, top, span,
    ) - 10
    top = paragraph(
        pdf,
        "Match the PDF to your paper: A4 or US Letter. Select page numbers "
        "in the print dialog. Print single-sided, portrait, at "
        "<b>100% / Actual size</b>. No folding or cutting is needed.",
        left, top, span,
    )
    if top < CARDS.MARGIN + 40:
        raise ValueError(f"Organizer text exceeds its safe area: bottom={top:.1f}")
    pdf.showPage()


def extra_signatures_page(pdf, width, height):
    CARDS.frame(pdf, width, height)
    left, right = CARDS.MARGIN + 24, width - CARDS.MARGIN - 24
    center = width / 2
    CARDS.label(pdf, "EXTRA SIGNATURES / PRINT AGAIN AS NEEDED", center,
                height - 79, size=9, centered=True)
    pdf.setFillColor(colors.black)
    pdf.setFont("Times-Roman", 28)
    pdf.drawCentredString(center, height - 121, "More wishes from our class")
    pdf.setFont("Helvetica", 12)
    pdf.drawCentredString(center, height - 148,
                         "Add a name, a kind wish or a little drawing.")
    pdf.drawString(left, height - 185, "Class / group")
    CARDS.writing_rule(pdf, left + 87, right, height - 189)

    columns, rows, gap = 2, 6, 10
    grid_top, grid_bottom = height - 212, CARDS.MARGIN + 74
    box_width = (right - left - gap) / columns
    box_height = (grid_top - grid_bottom - (rows - 1) * gap) / rows
    pdf.setStrokeColor(CARDS.QUIET)
    pdf.setLineWidth(0.65)
    for row in range(rows):
        for column in range(columns):
            x = left + column * (box_width + gap)
            y = grid_top - (row + 1) * box_height - row * gap
            pdf.roundRect(x, y, box_width, box_height, 5, stroke=1, fill=0)

    pdf.setFillColor(colors.black)
    pdf.setFont("Helvetica", 12)
    pdf.drawCentredString(center, CARDS.MARGIN + 47,
                         "Signing is optional. Leave unused spaces blank.")
    pdf.showPage()


def create_pdf(destination, size, size_name):
    pdf = canvas.Canvas(str(destination), pagesize=size, pageCompression=1,
                        invariant=1)
    pdf.setTitle(f"Teacher care pack - {size_name}")
    pdf.setAuthor("Quick Get Well")
    pdf.setSubject(
        "Four pages: organizer guide, coloring card, class card, extra signatures. "
        "Print selected pages single-sided at 100% / Actual size."
    )
    pdf.setCreator("Quick Get Well teacher care pack generator v1")
    organizer_page(pdf, *size)
    CARDS.coloring_card(pdf, *size)
    CARDS.class_card(pdf, *size)
    extra_signatures_page(pdf, *size)
    pdf.save()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path,
                        default=ROOT / "output" / "pdf" / "teacher-care-pack")
    parser.add_argument("--renderer", default=shutil.which("pdftoppm"))
    args = parser.parse_args()
    if not args.renderer:
        parser.error("pdftoppm (Poppler) is required to create previews.")
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for suffix, size, name in [("a4", A4, "A4"), ("letter", letter, "US Letter")]:
        destination = args.output_dir / f"teacher-care-pack-{suffix}-v1.pdf"
        create_pdf(destination, size, name)
        print(destination.resolve())

    a4_pdf = args.output_dir / "teacher-care-pack-a4-v1.pdf"
    for page, name in [(1, "teacher-care-pack-organizer-preview"),
                       (4, "teacher-care-pack-extra-signatures-preview")]:
        destination = args.output_dir / name
        subprocess.run([
            args.renderer, "-f", str(page), "-l", str(page), "-singlefile",
            "-scale-to-x", "480", "-scale-to-y", "-1", "-png",
            str(a4_pdf), str(destination),
        ], check=True)
        print(destination.with_suffix(".png").resolve())


if __name__ == "__main__":
    main()
