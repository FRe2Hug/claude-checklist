# Example session

An abridged run of `/checklist`. The request: *"I want a small CLI tool that renames my photo files by date."*
Questions are asked with Claude Code's `AskUserQuestion` picker; they're shown here as text.

---

**Claude:** Treating this as new work — questions first.

I looked around first. `./photos-tool` is empty, Python 3.12 and Node 24 are installed, no exiftool.

### Round 1 — goal and output

1. **Where does the date come from?**
   - **EXIF "date taken", falling back to file modified time (Recommended)** — the real shooting date, even after copying
   - EXIF only, skip and list files without it
   - File modified time only — simplest, but copying can change it
2. **New name format?**
   - **`2026-10-01_143052.jpg` (Recommended)** — sorts by time, readable
   - `20261001_143052.jpg`
   - `2026-10-01_143052_IMG_1234.jpg` — keeps the original name
3. **Which files?**
   - **JPEG + HEIC (Recommended)** · JPEG only · plus RAW · plus video
4. **How do you run it?**
   - **One Python script: `python rename_photos.py <folder>` (Recommended)** · standalone .exe · something else

**User:** Recommended for all, but also keep the original name.

**What I understand so far:** a Python script that renames JPEG/HEIC by EXIF date (fallback: modified time) to
`YYYY-MM-DD_HHMMSS_<original>.ext`.

### Round 2 — direction and don'ts

1. **Before renaming?** **Dry-run preview by default, `--apply` to rename (Recommended)** · rename immediately
2. **Same timestamp twice?** **Add `_2`, `_3` (Recommended)** · skip · ask each time
3. **Subfolders?** **Only with `--recursive` (Recommended)** · always · never
4. **Don'ts** *(multi-select)*: ☑ overwriting files · ☑ installing exiftool · ☑ a GUI · ☐ an undo log · ☑ extra dependencies besides Pillow

*(Round 3: built-in `coding` field questions — repo and tests. Round 4: scope and done-criteria.)*

### Summary

**What you told me:** Python script, EXIF → modified-time fallback, `YYYY-MM-DD_HHMMSS_<original>`, dry-run by default,
`_2` suffix on clashes, `--recursive` flag, no overwrites, Pillow only, no GUI, unit tests for naming.

**My assumptions (please confirm):** HEIC EXIF is read via `pillow-heif` — that's a second dependency.

**User:** Fine, allow pillow-heif. Proceed.

**Claude:** Saved the BRIEF → `~/.claude/mundap/briefs/2026-10-01_photos-tool_rename-by-date.md`
([what it looks like](brief.md)). Starting.

---

*(work happens)*

---

### Done check

| Done-criterion | Result | Evidence |
|---|---|---|
| Dry-run lists every planned rename, changes nothing | ✅ | `python rename_photos.py samples/` → 12 lines, `git status` clean |
| `--apply` renames JPEG and HEIC by EXIF date | ✅ | 12/12 renamed, `test_exif_date` passes |
| Files without EXIF use modified time | ✅ | `test_fallback_mtime` passes |
| Clashes get `_2`, never overwrite | ✅ | `test_clash_suffix` passes |
| Works on a 2,000-photo folder in under 10 s | ⚠️ not verified | no large sample folder here |

Don'ts: no overwrites ✅ · no exiftool ✅ · no GUI ✅ · deps = Pillow + pillow-heif (approved) ✅

Not done yet: the 2,000-photo timing check needs a real folder.

**User:** Ran it on my folder — 4 s. Done.

**Claude:** Set the BRIEF to `status: done`.

You said "always dry-run first" twice today. Save it as a rule — *"Tools that change files: dry-run by default"*?

**User:** Yes.

**Claude:** Added to `~/.claude/mundap/rules.md`.
