# mundap — Claude Code checklist plugin

**Ask before you build.** A checklist plugin (skill + hook) for Claude Code that makes Claude run a short, multi-round Q&A before any new task,
save the agreement as a BRIEF, and check the result against it before calling the work done.

[한국어](README.ko.md)

*mundap* (문답) is Korean for "questions and answers".

## What it does

- **Q&A checklist (`/mundap`)** — for new work: at least 3 rounds of questions with a recommended answer first →
  summary that separates *what you said* from *what Claude assumed* → your approval → BRIEF saved → work →
  a done-check table against the BRIEF at the end.
- **Size call up front** — on every request Claude says in one line whether it treats it as new work (questions first)
  or a continuation / small fix (no checklist), so you can overrule it.
- **Your language** — one skill, no language packs. Questions, summaries, BRIEFs and learned files follow the
  language you write in.
- **Learns your rules** — when you correct the same thing twice or say "from now on…", Claude proposes a one-line
  rule. Approved rules go to `~/.claude/mundap/rules.md` and are loaded in every session.
- **Learns your fields** — when a task doesn't match a known field, Claude drafts a field question list from the
  Q&A you just had. Approved, it's saved to `~/.claude/mundap/fields/<field>.md` and used next time.
- **Picks up where you left off** — open a session in a folder with an open BRIEF and Claude is told where it is.

Nothing is saved without your approval.

## Install

Requires Claude Code and `node` on your PATH (for the session-start hook; no npm packages).

```
claude plugin marketplace add FRe2Hug/mundap
claude plugin install mundap@mundap
```

Or inside Claude Code: `/plugin marketplace add FRe2Hug/mundap` → `/plugin install mundap@mundap`.

Start a new session, then just ask for something new — or type `/mundap <what you want>`.

## Your files

Everything you teach it lives outside the plugin, so updates never overwrite it.

| Path | What |
|---|---|
| `~/.claude/mundap/rules.md` | Your rules, one per line, injected every session. Edit freely. |
| `~/.claude/mundap/fields/*.md` | Your field question lists (used before the built-in ones). |
| `~/.claude/mundap/briefs/*.md` | BRIEFs. Set `status: done` to stop the reminder. |

Set `MUNDAP_HOME` to use a different folder.

## Built-in fields

`coding`, `docs`, `design` — in `plugin/skills/mundap/fields/`. Add your own by copying the format, e.g.
`~/.claude/mundap/fields/data-analysis.md`:

```markdown
# Field: data analysis

- **Question**: what decision the analysis should support
- **Data**: source, size, how fresh, known gaps
- **Output**: notebook / chart / one-page summary
- [Don't candidates] charts without the question answered, silently dropping rows
```

## Credits

Ideas borrowed from [obra/superpowers](https://github.com/obra/superpowers) (brainstorming: approval gate,
play back what you understood) and [mattpocock/skills](https://github.com/mattpocock/skills) (grilling: decision-tree
rounds, recommended answers).

## License

MIT
