// On every session open (startup, resume, clear, compact), inject the core rules, the user's own rules,
// the user's field list, and any open BRIEF for this folder. Never block the session: fail silently.
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.join(__dirname, '..');
const HOME = process.env.MUNDAP_HOME || path.join(os.homedir(), '.claude', 'mundap');
const RULES = path.join(HOME, 'rules.md');
const FIELDS = path.join(HOME, 'fields');
const BRIEFS = path.join(HOME, 'briefs');
const LEGACY_BRIEFS = path.join(os.homedir(), '.claude', 'briefs'); // read-only, older installs
const BUILTIN_FIELDS = path.join(ROOT, 'skills', 'mundap', 'fields');
const DONE = new Set(['done', 'closed', '완료']);

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', d => (raw += d));
process.stdin.on('end', () => {
  let ev = {};
  try { ev = JSON.parse(raw); } catch (e) { /* no input */ }
  try { emit(ev); } catch (e) { /* ignore */ }
  process.exit(0);
});

const norm = p => path.resolve(String(p || '')).toLowerCase();
const read = f => { try { return fs.readFileSync(f, 'utf8').trim(); } catch (e) { return ''; } };
const mdFiles = dir => { try { return fs.readdirSync(dir).filter(f => f.endsWith('.md')); } catch (e) { return []; } };

// Read only the front matter (key: value lines between ---)
function frontmatter(file) {
  const m = read(file).match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const out = {};
  if (m) for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i > 0) out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return out;
}

// Open BRIEFs started in this folder (or a parent of it)
function openBriefs(cwd) {
  if (!cwd) return [];
  const here = norm(cwd);
  return [LEGACY_BRIEFS, BRIEFS]
    .flatMap(dir => mdFiles(dir).map(f => path.join(dir, f)))
    .map(file => ({ file, ...frontmatter(file) }))
    .filter(b => !DONE.has(String(b.status || '').toLowerCase()) && b.cwd &&
      (here === norm(b.cwd) || here.startsWith(norm(b.cwd) + path.sep)))
    .slice(-5);
}

function emit(ev) {
  let text = read(path.join(ROOT, 'rules', 'core.md'));
  text += `\n\n## mundap paths\n- User rules: ${RULES}\n- User fields: ${FIELDS}\n- Built-in fields: ${BUILTIN_FIELDS}\n- BRIEFs: ${BRIEFS}`;

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
