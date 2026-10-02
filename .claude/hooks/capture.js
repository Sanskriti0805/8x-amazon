#!/usr/bin/env node
// 8x agent capture: logs verbatim prompt + final response per turn to .agent-logs/.
// Wired to UserPromptSubmit ("prompt") and Stop ("stop") in .claude/settings.json.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const LOGS = path.join(ROOT, '.agent-logs');
const STATE_DIR = path.join(ROOT, '.claude', 'capture-state');
const AUTHOR = 'Sanskriti0805';
const PROJECT = 'amazon-rebuild';
const DEFAULT_MODEL = 'claude-sonnet-5-5';

const mode = process.argv[2];
let raw = '';
process.stdin.on('data', (d) => (raw += d));
process.stdin.on('end', () => {
  try {
    run(JSON.parse(raw || '{}'));
  } catch (e) {
    try {
      fs.mkdirSync(LOGS, { recursive: true });
      fs.appendFileSync(path.join(LOGS, '_capture-errors.log'), `${new Date().toISOString()} ${mode}: ${e.stack}\n`);
    } catch {}
  }
  process.exit(0);
});

const iso = (d) => new Date(d).toISOString();
const stamp = (t) => iso(t).replace(/\.\d+Z$/, '').replace('T', '_').replace(/:/g, '-');

function loadState(sid) {
  try { return JSON.parse(fs.readFileSync(path.join(STATE_DIR, sid + '.json'), 'utf8')); } catch { return null; }
}
function saveState(sid, s) {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.writeFileSync(path.join(STATE_DIR, sid + '.json'), JSON.stringify(s));
}

function ensureFile(sid, state, firstTime, model) {
  if (state && fs.existsSync(path.join(LOGS, state.file))) return state;
  fs.mkdirSync(LOGS, { recursive: true });
  const file = `${stamp(firstTime)}_${sid}.md`;
  const s8 = sid.slice(0, 8);
  const head = `---
session_id: ${sid}
date: ${iso(firstTime).slice(0, 10)}
author: ${AUTHOR}
model: ${model}
tool: claude-code
project: ${PROJECT}
total_exchanges: 0
first_prompt_time: ${iso(firstTime)}
last_prompt_time: ${iso(firstTime)}
---

# Session Log - ${iso(firstTime).slice(0, 10)}

Session: \`${s8}\` | Project: \`${PROJECT}\` | Author: \`${AUTHOR}\`

---

`;
  fs.writeFileSync(path.join(LOGS, file), head);
  return { file, promptNum: 0, respNum: 0 };
}

function entry(type, num, sid, time, model, body) {
  return `[LOG_ENTRY type=${type} num=${num} session=${sid.slice(0, 8)}]\ntimestamp: ${iso(time)}\nmodel: ${model}\n\n${body}\n\n\n`;
}

function bumpHeader(state, lastPromptTime) {
  const p = path.join(LOGS, state.file);
  let t = fs.readFileSync(p, 'utf8');
  t = t.replace(/^total_exchanges: .*$/m, `total_exchanges: ${state.promptNum}`);
  if (lastPromptTime) t = t.replace(/^last_prompt_time: .*$/m, `last_prompt_time: ${iso(lastPromptTime)}`);
  fs.writeFileSync(p, t);
}

function textOf(content, dropSystem) {
  if (typeof content === 'string') return content;
  return (content || [])
    .filter((b) => b.type === 'text' && !(dropSystem && b.text.trimStart().startsWith('<system-reminder>')))
    .map((b) => b.text)
    .join('\n\n');
}

// Group transcript into turns: {prompt, promptTime, response, respTime, model}
function parseTurns(tp) {
  const lines = fs.readFileSync(tp, 'utf8').split('\n').filter(Boolean);
  const turns = [];
  let cur = null;
  for (const l of lines) {
    let o; try { o = JSON.parse(l); } catch { continue; }
    const m = o.message;
    if (!m || o.isSidechain) continue;
    if (o.type === 'user' && !o.isMeta) {
      const isToolResult = Array.isArray(m.content) && m.content.some((b) => b.type === 'tool_result');
      if (isToolResult) continue;
      const text = textOf(m.content, true);
      if (!text.trim() || /^<(command-|local-command|task-notification|ci-monitor)/.test(text.trimStart())) continue;
      cur = { prompt: text, promptTime: o.timestamp, response: '', respTime: null, model: null, _buf: '' };
      turns.push(cur);
    } else if (o.type === 'assistant' && cur) {
      if (m.model && m.model !== '<synthetic>') cur.model = m.model;
      const hasTool = Array.isArray(m.content) && m.content.some((b) => b.type === 'tool_use');
      const t = textOf(m.content, false);
      if (hasTool) cur._buf = ''; // text before a tool call is intermediate, not final
      if (t.trim() && !hasTool) { cur._buf += (cur._buf ? '\n\n' : '') + t; cur.response = cur._buf; cur.respTime = o.timestamp; }
    }
  }
  return turns;
}

function run(inp) {
  const sid = inp.session_id;
  if (!sid) return;
  let state = loadState(sid);

  if (mode === 'prompt') {
    const now = Date.now();
    const model = inp.model || DEFAULT_MODEL;
    state = ensureFile(sid, state, now, model);
    state.promptNum += 1;
    fs.appendFileSync(path.join(LOGS, state.file), entry('PROMPT', state.promptNum, sid, now, model, inp.prompt));
    bumpHeader(state, now);
    saveState(sid, state);
    return;
  }

  if (mode === 'stop') {
    if (!inp.transcript_path || !fs.existsSync(inp.transcript_path)) return;
    const turns = parseTurns(inp.transcript_path);
    if (!turns.length) return;
    state = ensureFile(sid, state, turns[0].promptTime, turns[0].model || DEFAULT_MODEL);
    const f = path.join(LOGS, state.file);
    for (let i = state.respNum; i < turns.length; i++) {
      const n = i + 1, t = turns[i];
      const model = t.model || DEFAULT_MODEL;
      if (n > state.promptNum) { // back-fill a prompt the prompt hook never saw
        fs.appendFileSync(f, entry('PROMPT', n, sid, t.promptTime, model, t.prompt));
        state.promptNum = n;
        bumpHeader(state, t.promptTime);
      }
      if (t.response) {
        fs.appendFileSync(f, entry('RESPONSE', n, sid, t.respTime, model, t.response));
        state.respNum = n;
      } else break;
    }
    saveState(sid, state);
  }
}
