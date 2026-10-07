# Changelog

## 1.3.0 — 2026-10-07
- Question rounds are sized to the work: small 1, medium 2, large 3–4 (was: always 3+). Size is stated up front;
  a user rule can set a minimum.
- Round 1 always offers "Take the recommendations for everything else" — straight to the summary.
- Learn from misses: each ⚠️ / ❌ in the done check, or a fix asked for after "done", is logged under the BRIEF's
  new "Lessons" section and proposed as a field question for next time (saved only on approval).
- New built-in fields: `3d-modeling`, `3d-print`.
- Hook: BRIEF `status` in other languages also closes it (`완료`, `完了`, `完成`, `terminé`, `terminado`, `erledigt` …).
- README: animated demo, "Why this one?" comparison with plan mode, superpowers, spec-kit and CLAUDE.md.

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
