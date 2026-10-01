// node --test
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const HOOK = path.join(__dirname, '..', 'plugin', 'hooks', 'session_start.js');
const base = path.join(os.tmpdir(), 'checklist-test-' + process.pid);

function run(home, input) {
  const r = spawnSync(process.execPath, [HOOK], {
    input, env: { ...process.env, CHECKLIST_HOME: home }, encoding: 'utf8',
  });
  assert.strictEqual(r.status, 0);
  return JSON.parse(r.stdout).hookSpecificOutput.additionalContext;
}
const briefsFor = (home, cwd) => {
  const m = run(home, JSON.stringify({ cwd })).match(/## Open BRIEFs[^\n]*\n([\s\S]*?)\nIf this/);
  return m ? m[1].split('\n').map(l => l.slice(2).split(' → ')[0]) : [];
};

const proj = path.join(base, 'work', 'proj');
const home = path.join(base, 'home');
fs.mkdirSync(path.join(home, 'briefs'), { recursive: true });
fs.mkdirSync(path.join(home, 'fields'), { recursive: true });
const brief = (name, body) => fs.writeFileSync(path.join(home, 'briefs', name), body);
brief('open.md', `---\ntitle: open\ncwd: ${proj}\nstatus: open\n---\n`);
brief('quoted.md', `---\ntitle: quoted\ncwd: "${proj}"\nstatus: open\n---\n`);
brief('crlf.md', `---\r\ntitle: crlf\r\ncwd: ${proj}\r\nstatus: open\r\n---\r\n`);
brief('done.md', `---\ntitle: done\ncwd: ${proj}\nstatus: Done\n---\n`);
brief('other.md', `---\ntitle: other\ncwd: ${proj}X\nstatus: open\n---\n`);
brief('broken.md', 'no front matter');
fs.writeFileSync(path.join(home, 'rules.md'), '- always dry-run first\n');
fs.writeFileSync(path.join(home, 'fields', 'data.md'), '# data\n');

test.after(() => fs.rmSync(base, { recursive: true, force: true }));

test('open BRIEFs match the folder and its subfolders only', () => {
  const want = ['crlf', 'open', 'quoted'];
  assert.deepStrictEqual(briefsFor(home, proj).sort(), want);
  assert.deepStrictEqual(briefsFor(home, path.join(proj, 'sub')).sort(), want);
  assert.deepStrictEqual(briefsFor(home, path.join(base, 'work')), []);
});

test('user rules and fields are injected', () => {
  const t = run(home, '{}');
  assert.match(t, /always dry-run first/);
  assert.match(t, /- User: data/);
  assert.match(t, /- Built-in: coding, design, docs/);
});

test('missing home folder and bad input do not fail', () => {
  const t = run(path.join(base, 'nope'), 'not json');
  assert.match(t, /- User: \(none yet\)/);
  assert.doesNotMatch(t, /## User rules/);
});
