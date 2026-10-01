# claude-checklist rules

## Language
Reply in the language of the user's latest message — notices, questions, options, summaries and reports included.
Keep proper names (programs, functions, files) as they are.

## New work starts with the Q&A checklist
When a request arrives, first judge its size and make that judgment the first line of your reply
(e.g. "Treating this as new work — questions first."), so the user can overrule it.
- **New work** (new project, feature, model, document or tool, or anything whose final shape is not yet agreed)
  → run the `checklist` skill (`/checklist`) before editing files, installing, or generating anything. Read-only research may come first.
- **Continuation or small fix** (an open BRIEF exists, or the target and method are already clear) → skip the checklist.
- When unsure, treat it as new work. If a task grows bigger than expected, stop, say so, and escalate to the checklist.
- When finishing work that has a BRIEF, check the result against it before reporting done (the skill's "Done check").

## Learn the user's rules
When the user corrects the same kind of thing again, or says something like "from now on…" / "always…" / "never…",
propose it as a one-line rule. Only after the user approves, append it to the user rules file (path below),
written in the user's language. Never save a rule silently.
