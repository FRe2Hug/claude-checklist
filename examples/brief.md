---
title: Rename photos by date
cwd: /home/alex/code/photos-tool
date: 2026-10-01
field: coding
status: open
---

# Rename photos by date

## Goal and output
- What and why: rename camera / phone photos so they sort by shooting time
- Final output: `rename_photos.py` + tests in `./photos-tool`
- Who uses it: me, from a terminal
- Starting material: empty folder; sample photos in `samples/`

## Direction
- Python 3.12, Pillow (+ pillow-heif for HEIC)
- Date: EXIF DateTimeOriginal, fallback to file modified time
- Name: `YYYY-MM-DD_HHMMSS_<original>.ext`
- Dry-run by default, `--apply` to rename, `--recursive` for subfolders

## Don'ts
- [ ] Overwrite any existing file
- [ ] Install exiftool or other system tools
- [ ] Build a GUI
- [ ] Add dependencies beyond Pillow / pillow-heif

## Scope
- In this time: script, CLI flags, unit tests for naming and clashes
- Out this time: video files, RAW files, undo log

## Done-criteria (checkable sentences)
1. Dry-run lists every planned rename and changes nothing (`git status` clean).
2. `--apply` renames JPEG and HEIC by EXIF date.
3. Files without EXIF use modified time.
4. Name clashes get `_2`, `_3` … and nothing is overwritten.
5. A 2,000-photo folder finishes in under 10 s.

## Constraints
- Deadline / environment / where to save: none / Linux + Windows / `./photos-tool`

## Assumptions (confirmed by the user?)
- HEIC read through pillow-heif — confirmed

## Decision log
- 2026-10-01 Keep original name as suffix — user wants to trace back to camera numbering
- 2026-10-01 Allow pillow-heif — needed for HEIC
