// On every session open (startup, resume, clear, compact), inject the core rules, the user's own rules,
// the user's field list, and any open BRIEF for this folder. Never block the session: fail silently.
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.join(__dirname, '..');
const HOME = process.env.CHECKLIST_HOME || path.join(os.homedir(), '.claude', 'checklist');
const RULES = path.join(HOME, 'rules.md');
const FIELDS = path.join(HOME, 'fields');
const BRIEFS = path.join(HOME, 'briefs');
const BUILTIN_FIELDS = path.join(ROOT, 'skills', 'checklist', 'fields');
// Closed statuses, including common words in other languages so users can write status in their own language
const DONE = new Set(['done', 'closed', '완료', '完了', '完成', '已完成', 'terminé', 'terminado', 'erledigt', 'fertig']);

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', d => (raw += d));
process.stdin.on('end', () => {
  let ev = {};
  try { ev = JSON.parse(raw); } catch (e) { /* no input */ }
  try { emit(ev); } catch (e) { /* ignore */ }
  process.exit(0);
});

const read = f => { try { return fs.readFileSync(f, 'utf8').trim(); } catch (e) { return ''; } };
const mdFiles = dir => { try { return fs.readdirSync(dir).filter(f => f.endsWith('.md')); } catch (e) { return []; } };

// Read only the front matter (key: value lines between ---)
function frontmatter(file) {
  const m = read(file).match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const out = {};
  if (m) for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i > 0) out[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^(["'])(.*)\1$/, '$2');
  }
  return out;
}

// Open BRIEFs started in this folder (or a parent of it)
function openBriefs(cwd) {
  if (!cwd) return [];
  const inside = dir => {
    const rel = path.relative(path.resolve(dir), path.resolve(cwd));
    return !rel.startsWith('..') && !path.isAbsolute(rel);
  };
  return mdFiles(BRIEFS)
    .map(f => ({ file: path.join(BRIEFS, f), ...frontmatter(path.join(BRIEFS, f)) }))
    .filter(b => b.cwd && !DONE.has(String(b.status).toLowerCase()) && inside(b.cwd))
    .slice(-5);
}

function emit(ev) {
  let text = read(path.join(ROOT, 'rules', 'core.md'));
  text += `\n\n## checklist paths\n- User rules: ${RULES}\n- User fields: ${FIELDS}\n- Built-in fields: ${BUILTIN_FIELDS}\n- BRIEFs: ${BRIEFS}`;

  const rules = read(RULES);
  if (rules) text += `\n\n## User rules (${RULES})\n${rules}`;

  const fields = mdFiles(FIELDS).map(f => f.replace(/\.md$/, ''));
  const builtin = mdFiles(BUILTIN_FIELDS).map(f => f.replace(/\.md$/, ''));
  text += `\n\n## Known fields\n- User: ${fields.join(', ') || '(none yet)'}\n- Built-in: ${builtin.join(', ')}`;

  const briefs = openBriefs(ev.cwd);
  if (briefs.length) {
    text += '\n\n## Open BRIEFs for this folder\n' +
      briefs.map(b => `- ${b.title || path.basename(b.file)} → ${b.file}`).join('\n') +
      '\nIf this is a continuation, read the matching BRIEF first and follow what it agreed.';
  }
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: text },
  }));
}
