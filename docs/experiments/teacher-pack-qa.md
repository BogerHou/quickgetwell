# Teacher care pack: artifact QA

This is a record of generation and technical/visual checks, not a human
editorial approval or evidence of customer demand. No existing cards or site
pages were changed to create this pack.

## Outputs

- `assets/printables/teacher-care-pack-a4-v1.pdf`: 4 pages, each 595.2756 x
  841.8898 pt (A4, 210 x 297 mm).
- `assets/printables/teacher-care-pack-letter-v1.pdf`: 4 pages, each 612 x
  792 pt (US Letter, 8.5 x 11 in).
- `teacher-care-pack-organizer-preview.png`: 480 x 679 px, from A4 page 1.
- `teacher-care-pack-extra-signatures-preview.png`: 480 x 679 px, from A4 page 4.

Both PDFs contain, in order: organizer instructions; the existing coloring
card; the existing 24-space class card; a repeatable sheet with 12 wider
signature spaces. The extra sheet has no sequential student numbering.

## Content and print checks

- Organizer text and extra-sheet instructions use 12 pt body type. Headings
  are larger; small navigation labels and the site footer are smaller.
- Instructions cover voluntary participation, the school's usual communication
  channel, no health questions, no requests about lessons or returning to
  school, respect for privacy/no-message requests, and no reply expected.
- Print instructions identify page 2, page 3 and repeatable page 4, matching
  paper size, selecting page numbers, single-sided portrait printing and
  100% / Actual size. Unused signature spaces can be left blank.
- Invitation text matches the experiment page copy supplied for this pack:

  > We're putting together a card for [Teacher's name]. If you'd like to take
  > part, please add a short note, your name, or a drawing by [day]. You do not
  > need to write about their health. Taking part is optional. Please give your
  > note to [organizer].

## Validation performed

- Generated first in `output/pdf/teacher-care-pack/`; copied only the four new
  final assets after checks.
- Rendered all eight pages using Poppler at 110 dpi and visually inspected
  every A4 and Letter page. No clipped text, overlaps, broken glyphs, cramped
  body text or obstructed writing areas were observed.
- Checked PDF page counts, dimensions, extracted text margins and the 12
  extra signature boxes using pypdf/pdfplumber. All text remains inside the
  0.6-inch outer frame boundary.
- Compared rendered pixels: new pages 2 and 3 exactly match old pages 1 and 2
  for both paper sizes at the same resolution.
- Re-generated both PDFs and previews into a separate temporary directory;
  all four outputs were byte-identical. ReportLab invariant mode fixes PDF
  timestamps and IDs.
- No whole-site build was run as part of this asset task. Physical printing
  has not been tested.

## SHA-256 checksums

Existing files, unchanged before and after generation:

```text
a70183ffbe46923f025dd8efb43054a6027077fa89545ca329e0def9cc31c242  teacher-get-well-cards-a4-v1.pdf
58baebc2ca8b4021c97e47f1815758ba323ee3f627d2a138c03f64b241a17d02  teacher-get-well-cards-letter-v1.pdf
edfb3b0bfe1970110c669dfa2a0bbbf873cf07aef31f14de98805bb9cdc91ee3  scripts/generate-printable-cards.py
```

New PDFs:

```text
7d9e076df46af70d57fc8f2e848698321fcff8ae8a1913482eb0b235dfc78492  teacher-care-pack-a4-v1.pdf
7da7f7de28fe57707f428e3163bef618a0a6a7276b3614711a9bf0b9ab07707e  teacher-care-pack-letter-v1.pdf
```

## Reproduce

```sh
python3 scripts/generate-teacher-care-pack.py --output-dir output/pdf/teacher-care-pack
```

Requires ReportLab and Poppler's `pdftoppm`. Use `--renderer /path/to/pdftoppm`
when Poppler is not on PATH. The script reads the original generator via
`importlib` and does not write its source or the old card files.
