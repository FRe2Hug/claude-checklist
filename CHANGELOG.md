# Changelog

## 1.2.1 — 2026-10-01
- Fix: BRIEFs with a quoted `cwd` (`cwd: "C:\work"`) were never matched.
- Folder matching uses `path.relative`: correct case handling per OS, works for drive roots.
- Only `~/.claude/checklist/briefs/` is read; status `done` or `closed` ends the reminder.
- Skill no longer triggers on the bare word "check". Research example made generic.
- Added hook tests (`test/session_start.test.js`).

## 1.2.0 — 2026-10-01
- User files moved to `~/.claude/checklist/` (rules, fields, briefs). Override with `CHECKLIST_HOME`.

## 1.1.2 — 2026-10-01
- Fix: the skill-only path fallback promised in 1.1.1 was missing from SKILL.md.

## 1.1.1 — 2026-10-01
- Skill works without the plugin hook: falls back to default paths when the session context has none.
- README: example excerpt, skill-only install, how to turn it off.
- Added `examples/session.md` (full walk-through) and `examples/brief.md` (saved BRIEF).

## 1.1.0 — 2026-10-01
- Command, plugin, marketplace and repository all named `checklist` / `claude-checklist`.
  Install with `claude plugin install claude-checklist@claude-checklist`.

## 1.0.0 — 2026-10-01
- First public release.
- Q&A checklist skill: research first, 3+ question rounds with recommended answers, summary split into
  "what you said" / "my assumptions", approval gate, BRIEF, done-check table.
- Session-start hook: size call on every request, user rules, known fields, open BRIEFs for the folder.
- Follows the user's language — one skill, no language packs.
- Learns user rules and fields (propose → approve → save).
- Built-in fields: coding, docs, design.
