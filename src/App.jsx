import { useState, useEffect, useRef, useCallback } from "react";
import { NIGERIA, SUBJECT_TOPICS } from "./data/curriculum.js";
import { getFallback } from "./data/questionBank.js";
import { OPENAI_KEY, REMOTE_DB, APP_COMPANY, GAME_CONFIG, STORAGE_KEYS } from "./constants/config.js";
import "./styles/theme.css";
import {
  BookOpen, Trophy, Settings, Volume2, VolumeX, X, ChevronRight, ChevronLeft,
  Play, RotateCcw, Home, Printer, Bot, Upload, Database, PenLine, Trash2,
  Plus, CheckCircle2, XCircle, AlertCircle, Info, Lightbulb,
  GraduationCap, Users, Star, Medal, Award, Target,
  Save, BarChart2, CheckCheck, Circle, Package, Copy, ArrowRight,
  ClipboardList, Zap, Flame
} from "lucide-react";

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800;1,9..40,400&family=Playfair+Display:wght@700;900&display=swap');
:root {
  --forest:#0a3d2e;--forest2:#0f5240;--moss:#1a6b50;--emerald:#22c55e;
  --amber:#f59e0b;--amber2:#fbbf24;--cream:#fdf6ec;--gold:#d4a843;
  --rust:#c45c1a;--red:#dc2626;--sky:#0ea5e9;--ink:#0c1a13;
  --ink2:#1a2e22;--ink3:#2d4a38;--mist:#8aab97;--ghost:#c8ddd2;
  --bg:var(--ink);--surface:var(--ink2);--surface2:var(--ink3);
  --border:#2a4535;--border2:#3a5a48;--text:var(--cream);--text2:var(--ghost);--text3:var(--mist);
  --display:'Playfair Display',Georgia,serif;--body:'DM Sans','Helvetica Neue',sans-serif;
  --t-xs:clamp(10px,1.2vw + 4px,12px);--t-sm:clamp(12px,1.4vw + 5px,14px);
  --t-md:clamp(14px,1.6vw + 6px,16px);--t-lg:clamp(16px,2vw + 6px,20px);
  --t-xl:clamp(20px,3vw + 6px,28px);--t-2xl:clamp(28px,4.5vw + 4px,44px);
  --t-3xl:clamp(36px,7vw + 2px,72px);
  --s-1:clamp(4px,.8vw,6px);--s-2:clamp(6px,1vw,10px);--s-3:clamp(10px,1.5vw,16px);
  --s-4:clamp(14px,2vw,24px);--s-5:clamp(20px,3vw,36px);--s-6:clamp(28px,4.5vw,56px);
  --r-sm:8px;--r-md:14px;--r-lg:22px;--r-xl:32px;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
*{touch-action:pan-y;-webkit-overflow-scrolling:touch;}
html,body{height:100%;width:100%;margin:0;padding:0;}
#root{position:fixed;inset:0;font-family:var(--body);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;overflow:hidden;}
.screen{position:absolute;inset:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain;}
::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px;}
button{font-family:var(--body);cursor:pointer;border:none;background:none;}
input,textarea,select{font-family:var(--body);}a{color:var(--amber);}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes popIn{0%{transform:scale(.85) translateY(8px);opacity:0}65%{transform:scale(1.03)}100%{transform:scale(1);opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
@keyframes glow{0%,100%{opacity:.4}50%{opacity:.9}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes confetti{to{transform:translateY(110vh) rotate(720deg);opacity:0}}
@keyframes timerPulse{0%,100%{box-shadow:0 0 0 0 #dc262655}50%{box-shadow:0 0 0 8px #dc262600}}
@keyframes slideDown{from{transform:translateY(-100%);opacity:0}to{transform:none;opacity:1}}
@keyframes streakFire{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.1)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.a-fadeUp{animation:fadeUp .4s cubic-bezier(.22,1,.36,1) both}
.a-fadeIn{animation:fadeIn .3s ease both}
.a-pop{animation:popIn .4s cubic-bezier(.34,1.56,.64,1) both}
.a-float{animation:float 3s ease-in-out infinite}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:700;font-size:var(--t-md);padding:12px 24px;border-radius:var(--r-md);cursor:pointer;border:none;transition:transform .15s,filter .15s,box-shadow .15s;-webkit-tap-highlight-color:transparent;white-space:nowrap;}
.btn:hover{filter:brightness(1.1);transform:translateY(-1px);}
.btn:active{transform:scale(.97) translateY(0);}
.btn-primary{background:linear-gradient(135deg,var(--amber) 0%,var(--rust) 100%);color:var(--ink);box-shadow:0 4px 24px #f59e0b44;}
.btn-green{background:linear-gradient(135deg,var(--moss) 0%,var(--forest2) 100%);color:var(--cream);box-shadow:0 4px 20px #1a6b5044;}
.btn-ghost{background:transparent;border:1.5px solid var(--border2);color:var(--text2);transition:border-color .15s,color .15s,transform .15s,filter .15s;}
.btn-ghost:hover{border-color:var(--amber);color:var(--amber);}
.btn-danger{background:#7f1d1d;border:1px solid #ef4444;color:#fca5a5;}
.btn-full{width:100%;}.btn-lg{padding:16px 36px;font-size:var(--t-lg);border-radius:var(--r-lg);}
.btn-sm{padding:7px 14px;font-size:var(--t-sm);border-radius:var(--r-sm);}
.btn-icon{padding:10px;border-radius:var(--r-sm);width:42px;height:42px;}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:var(--s-4);}
.card-raised{background:var(--surface);border:1px solid var(--border2);border-radius:var(--r-lg);padding:var(--s-4);box-shadow:0 8px 32px #00000033,0 1px 0 #3a5a4844 inset;}
.input{width:100%;background:var(--ink3);border:1.5px solid var(--border);border-radius:var(--r-md);color:var(--text);font-size:var(--t-md);padding:12px 16px;outline:none;transition:border-color .2s,box-shadow .2s;}
.input:focus{border-color:var(--amber);box-shadow:0 0 0 3px #f59e0b22;}
.input::placeholder{color:var(--text3);}
.select{width:100%;background:var(--ink3);border:1.5px solid var(--border);border-radius:var(--r-md);color:var(--text);font-size:var(--t-md);padding:12px 40px 12px 16px;outline:none;cursor:pointer;-webkit-appearance:none;appearance:none;transition:border-color .2s;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238aab97' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;}
.select:focus{border-color:var(--amber);}.select option{background:var(--ink2);}
.label{font-size:var(--t-sm);font-weight:700;color:var(--text3);display:block;margin-bottom:6px;letter-spacing:.5px;text-transform:uppercase;}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:var(--t-xs);font-weight:700;letter-spacing:.5px;}
.badge-amber{background:#f59e0b22;border:1px solid #3d099155;color:var(--amber2);}
.badge-green{background:#22c55e18;border:1px solid #1d317344;color:#4ade80;}
.badge-red{background:#dc262618;border:1px solid #e5141455;color:#fca5a5;}
.badge-blue{background:#0ea5e918;border:1px solid #0ea5e944;color:#7dd3fc;}
.badge-muted{background:var(--ink3);border:1px solid var(--border);color:var(--text3);}
.progress{height:6px;background:var(--ink3);border-radius:3px;overflow:hidden;}
.progress-fill{height:100%;border-radius:3px;transition:width .4s ease;background:linear-gradient(90deg,var(--forest2),var(--amber));}
.divider{border:none;border-top:1px solid var(--border);margin:var(--s-4) 0;}
.overlay{position:fixed;inset:0;background:#00000088;backdrop-filter:blur(4px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:var(--s-4);animation:fadeIn .2s ease;}
.modal{background:var(--ink2);border:1px solid var(--border2);border-radius:var(--r-xl);padding:var(--s-5);width:100%;max-width:520px;max-height:90vh;overflow-y:auto;animation:popIn .35s cubic-bezier(.34,1.56,.64,1);}
.modal.wide{max-width:680px;}
.modal-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--s-4);}
.modal-title{font-family:var(--display);font-size:var(--t-xl);color:var(--text);}
.callout{border-radius:var(--r-md);padding:12px 16px;display:flex;gap:10px;font-size:var(--t-sm);}
.callout-warn{background:#2d250018;border:1px solid #f59e0b44;}
.callout-info{background:#0ea5e918;border:1px solid #0ea5e944;}
.callout-ok{background:#22c55e0f;border:1px solid #22c55e44;}
.callout-err{background:#dc26260f;border:1px solid #dc262644;}
.callout-icon{font-size:18px;flex-shrink:0;line-height:1.5;}
.callout-body{color:var(--text2);line-height:1.6;}
.callout-body strong{color:var(--text);display:block;margin-bottom:2px;}
.grid2{display:grid;grid-template-columns:repeat(2,1fr);gap:var(--s-3);}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--s-3);}
@media(max-width:480px){.grid3{grid-template-columns:repeat(2,1fr);}.grid2{grid-template-columns:1fr;}}
.spin{width:40px;height:40px;border:3px solid var(--border2);border-top-color:var(--amber);border-radius:50%;animation:spin .7s linear infinite;}
.sync-dot{width:8px;height:8px;border-radius:50%;display:inline-block;}
.sync-online{background:var(--emerald);box-shadow:0 0 6px var(--emerald);animation:glow 2s infinite;}
.sync-offline{background:var(--amber);animation:glow 1.5s infinite;}
`;

// Icon helper — consistent sizing and stroke throughout the app
function Ic({ icon: Icon, size = 16, color, style, className }) {
  return <Icon size={size} color={color} style={style} className={className} strokeWidth={2} />;
}


const ls = { get: k => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : null; } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } }, del: k => { try { localStorage.removeItem(k); } catch { } } };
const { DB: DB_KEY, QUEUE: QUEUE_KEY, BANK: BANK_KEY, LEADERBOARD: LB_KEY, META: META_KEY } = STORAGE_KEYS;
// ── SILENT REMOTE DB — owner-configured, never shown to users ──
const _REMOTE_DB = REMOTE_DB;

function dbGet() { return ls.get(DB_KEY) || []; }
function dbSave(questions) {
  const db = dbGet(), seen = new Set(db.map(q => q.q?.trim().toLowerCase()));
  const fresh = questions.filter(q => q.q && !seen.has(q.q.trim().toLowerCase()));
  const updated = [...db, ...fresh]; ls.set(DB_KEY, updated);
  const meta = ls.get(META_KEY) || { total: 0, bySubject: {} };
  meta.total = updated.length; meta.updated = new Date().toISOString();
  fresh.forEach(q => { const k = `${q.className}||${q.subject}`; meta.bySubject[k] = (meta.bySubject[k] || 0) + 1; });
  ls.set(META_KEY, meta); queueForSync(fresh); return { added: fresh.length, total: updated.length };
}
function dbGetBySubject(cn, sub) { return dbGet().filter(q => q.subject === sub && q.className === cn); }
function queueForSync(qs) { if (!qs.length) return; const q = ls.get(QUEUE_KEY) || []; ls.set(QUEUE_KEY, [...q, ...qs.map(q => ({ ...q, _queued: Date.now() }))]); }
function getQueue() { return ls.get(QUEUE_KEY) || []; }
function clearQueue() { ls.del(QUEUE_KEY); }
function bankGet() { return ls.get(BANK_KEY) || []; }
function bankAdd(qs) { const b = bankGet(), seen = new Set(b.map(q => q.q?.trim().toLowerCase())); const fr = qs.filter(q => q.q && !seen.has(q.q.trim().toLowerCase())); ls.set(BANK_KEY, [...b, ...fr]); return fr.length; }
function bankGetBySubject(cn, sub) { return bankGet().filter(q => q.subject === sub && q.className === cn); }
function lbGet() { return ls.get(LB_KEY) || []; }
function lbSave(e) { const lb = lbGet(); lb.push({ ...e, date: new Date().toLocaleDateString("en-NG") }); lb.sort((a, b) => b.pct - a.pct || b.score - a.score); ls.set(LB_KEY, lb.slice(0, 100)); }
function lbClear() { ls.del(LB_KEY); }
function exportDB() { const blob = new Blob([JSON.stringify({ meta: ls.get(META_KEY), questions: dbGet() }, null, 2)], { type: "application/json" }); const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `etow_db_${new Date().toISOString().split("T")[0]}.json` }); a.click(); URL.revokeObjectURL(a.href); }


// SOUND ENGINE
let _ac = null;
let _muted = false;

function getAudioContext() {
  if (!_ac) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      console.warn("Web Audio API is not supported.");
      return null;
    }

    _ac = new AudioContext();
  }

  return _ac;
}

// Must be called from a real user interaction
async function unlockAudio() {
  try {
    const c = getAudioContext();
    if (!c) return false;

    if (c.state === "suspended") {
      await c.resume();
    }

    return c.state === "running";
  } catch (err) {
    console.warn("Audio unlock failed:", err);
    return false;
  }
}

async function beep(freq, type = "sine", dur = 0.1, vol = 0.12) {
  if (_muted) return;

  try {
    const c = getAudioContext();
    if (!c) return;

    // IMPORTANT: wait for AudioContext to become active
    if (c.state === "suspended") {
      await c.resume();
    }

    if (c.state !== "running") {
      console.warn("AudioContext is not running:", c.state);
      return;
    }

    const oscillator = c.createOscillator();
    const gain = c.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, c.currentTime);

    oscillator.connect(gain);
    gain.connect(c.destination);

    const now = c.currentTime;

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + Math.max(dur, 0.02)
    );

    oscillator.start(now);
    oscillator.stop(now + dur);
  } catch (err) {
    console.warn("Beep failed:", err);
  }
}

const Sound = {

  setMuted(value) {
    _muted = Boolean(value);
  },

  isMuted() {
    return _muted;
  },

  async unlock() {
    return await unlockAudio();
  },

  correct() {
    if (_muted) return;

    beep(523, "sine", 0.08, 0.12);

    setTimeout(() => {
      beep(659, "sine", 0.10, 0.12);
    }, 100);

    setTimeout(() => {
      beep(784, "sine", 0.18, 0.12);
    }, 210);
  },

  wrong() {
    if (_muted) return;

    beep(220, "sawtooth", 0.18, 0.10);

    setTimeout(() => {
      beep(180, "sawtooth", 0.22, 0.08);
    }, 140);
  },

  select() {
    beep(440, "sine", 0.10, 0.08);
  },

  tick() {
    beep(880, "sine", 0.055, 0.05);
  },

  urgent() {
    beep(1320, "sine", 0.06, 0.07);
  },

  pull() {
    if (_muted) return;

    try {
      const c = getAudioContext();
      if (!c) return;

      const play = async () => {
        if (c.state === "suspended") {
          await c.resume();
        }

        const buffer = c.createBuffer(
          1,
          Math.floor(c.sampleRate * 0.25),
          c.sampleRate
        );

        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
          data[i] =
            (Math.random() * 2 - 1) *
            (1 - i / data.length) *
            0.12;
        }

        const source = c.createBufferSource();
        source.buffer = buffer;
        source.connect(c.destination);
        source.start();
      };

      play();
    } catch (err) {
      console.warn("Pull sound failed:", err);
    }
  },

  victory() {
    if (_muted) return;

    const notes = [523, 659, 784, 1047, 1319];

    notes.forEach((freq, i) => {
      setTimeout(() => {
        beep(freq, "sine", 0.30, 0.12);
      }, i * 120);
    });
  }
};

//JSON REPAIR PARSER
function parseAI(raw) {
  let t = raw.replace(/```json|```/gi, "").trim();
  try { return JSON.parse(t); } catch { }
  const s = t.indexOf("["); if (s !== -1) { t = t.slice(s); try { const m = t.match(/\[[\s\S]*\]/); if (m) return JSON.parse(m[0]); } catch { } }
  const objs = []; let depth = 0, inStr = false, esc = false, start = -1;
  for (let i = 0; i < t.length; i++) { const ch = t[i]; if (esc) { esc = false; continue; } if (ch === "\\" && inStr) { esc = true; continue; } if (ch === '"') { inStr = !inStr; continue; } if (inStr) continue; if (ch === "{") { if (depth === 0) start = i; depth++; } else if (ch === "}") { depth--; if (depth === 0 && start !== -1) { try { objs.push(JSON.parse(t.slice(start, i + 1).replace(/[\u0000-\u001F]/g, " ").replace(/,\s*([}\]])/g, "$1"))); } catch { } start = -1; } } }
  if (objs.length) return objs;
  throw new Error("Cannot parse AI response");
}
const isValidQ = q => q && typeof q.q === "string" && q.q.trim().length > 5 && Array.isArray(q.options) && q.options.length === 4 && q.options.every(o => typeof o === "string" && o.length > 0) && typeof q.answer === "number" && q.answer >= 0 && q.answer <= 3;

//  AI GENERATORS
// Uses gpt-4o-mini: fast, accurate, ideal for educational questions
const _OKEY = OPENAI_KEY;

function getTopics(subject, levelKey) {
  const m = SUBJECT_TOPICS[subject]; if (!m) return null;
  if (levelKey==="primary") return m.primary||m.junior||m.senior;
  if (levelKey==="junior") return m.junior||m.senior||m.primary;
  return m.senior||m.junior||m.primary;
}

async function callOpenAI(messages, signal, attempt = 0) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${_OKEY}` },
    signal,
    body: JSON.stringify({ model: "gpt-4o-mini", max_tokens: 4096, temperature: 0.7, messages })
  });
  if (res.status === 429) {
    if (attempt >= 2) throw Object.assign(new Error("RATE_LIMIT"), { isRateLimit: true });
    const wait = parseInt(res.headers.get("retry-after") || "0") * 1000 || [8000, 16000][attempt];
    await new Promise(r => setTimeout(r, wait));
    return callOpenAI(messages, signal, attempt + 1);
  }
  if (res.status === 401) throw new Error("API configuration error — please contact support");
  if (!res.ok) { const e = await res.text().catch(() => ""); throw new Error(`AI error ${res.status}`); }
  return res;
}

async function aiGenerate({ levelLabel, className, subject, difficulty, count, signal, levelKey }) {
  const topics = getTopics(subject, levelKey);
  const topicHint = topics?.length ? `\nTopics:\n${topics.slice(0, 10).map(t => `• ${t}`).join("\n")}` : "";
  const isLang = ["Yoruba", "Igbo", "Hausa"].includes(subject);
  const langNote = isLang ? `\nIMPORTANT: This is a Nigerian ${subject} language subject. Questions MUST test ${subject} vocabulary, grammar, proverbs, literature, oral tradition and culture. Include ${subject} words/phrases with English translations where helpful.` : "";
  const prompt = `You are a senior Nigerian curriculum specialist (NERDC) with deep expertise in ${subject}.${langNote}
Generate exactly ${count + 5} WAEC-style multiple-choice questions for ${className} students on ${subject}.
Level: ${levelLabel} | Difficulty: ${difficulty} | Country: Nigeria (NERDC)${topicHint}

STRICT RULES:
1. Every question must be SPECIFICALLY about ${subject} — no generic questions
2. Match the exact ${className} syllabus and age group
3. Options: exactly 4, formatted "A) ...", "B) ...", "C) ...", "D) ..."
4. "answer" = 0-based index of correct option (0=A, 1=B, 2=C, 3=D)
5. "topic" = the specific ${subject} sub-topic this question tests (e.g. "Photosynthesis", "Quadratic Equations", "Civil War 1967")
6. "explanation" = a SUBJECT-SPECIFIC explanation (2-4 sentences) that:
   - States WHY the correct answer is right using ${subject} concepts/facts
   - References the specific ${subject} principle, law, formula, or historical fact
   - Helps the student understand the ${subject} concept, not just the answer
   - Example for Biology: "The mitochondria produces ATP through cellular respiration. It is called the powerhouse because it generates most of the cell's energy supply through oxidative phosphorylation."
   - Example for Mathematics: "Using the quadratic formula x=(-b±√(b²-4ac))/2a with a=1,b=-5,c=6 gives x=3 or x=2. Always check by substituting back."
   - Example for History: "The Berlin Conference of 1884-85 was called by Bismarck where European powers partitioned Africa without African representation. Nigeria was placed under British control at this conference."
   - NEVER write generic phrases like 'This is the correct answer' or 'Option D is right'

Output ONLY a raw JSON array with no markdown, no code blocks, no extra text:
[{"q":"question text","options":["A) ...","B) ...","C) ...","D) ..."],"answer":0,"explanation":"subject-specific explanation here","topic":"specific sub-topic"}]`;
  const res = await callOpenAI([{ role: "system", content: "You are a Nigerian NERDC curriculum expert. Always respond with only raw JSON, no markdown." }, { role: "user", content: prompt }], signal);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const raw = data.choices?.[0]?.message?.content || "";
  if (!raw) throw new Error("Empty response from AI");
  const parsed = parseAI(raw);
  if (!Array.isArray(parsed)) throw new Error("AI did not return an array");
  const valid = parsed.filter(isValidQ);
  if (!valid.length) throw new Error(`AI returned 0 valid ${subject} questions — try again`);
  // If AI returned fewer than requested, top up from offline bank
  let result = valid.slice(0, count);
  if (result.length < count) {
    const fallbackPool = getFallback(className, subject, count - result.length);
    const extra = fallbackPool
      .filter(fq => !result.some(r => r.q === fq.q))
      .slice(0, count - result.length);
    result = [...result, ...extra];
  }
  return result.slice(0, count).map(q => ({ ...q, __ai: true, subject, className }));
}

async function aiFromNotes({ notesText, subject, className, count }) {
  const prompt = `You are a Nigerian teacher's assistant. A teacher uploaded lesson notes for "${subject}" (${className} students, NERDC curriculum).\nGenerate exactly ${count} multiple-choice questions from ONLY the notes content below.\nNOTES:\n---\n${notesText.slice(0, 7000)}\n---\nRules:
- Questions from the notes content ONLY
- "explanation" must be 2-3 sentences quoting or referencing the specific concept from the notes
- 4 options: A) B) C) D) format
- "answer" = 0-based index (0=A,1=B,2=C,3=D)
- "topic" = the sub-topic from the notes this question covers
- Explanations must name the specific fact, formula, or concept from the teacher's notes — never write "This is correct" or generic phrases\nOutput ONLY raw JSON array:\n[{"q":"?","options":["A) ","B) ","C) ","D) "],"answer":0,"explanation":"...","topic":"..."}]`;
  const res = await callOpenAI([{ role: "system", content: "You are a Nigerian teacher assistant. Respond with only raw JSON, no markdown." }, { role: "user", content: prompt }], null);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const raw = data.choices?.[0]?.message?.content || "";
  const parsed = parseAI(raw); const valid = (Array.isArray(parsed) ? parsed : []).filter(isValidQ);
  if (!valid.length) throw new Error("No valid questions from notes");
  return valid.slice(0, count).map(q => ({ ...q, __ai: true, subject, className, fromNotes: true }));
}

// OFFLINE FALLBACK
// SYNC HOOK 
function useSyncStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);
  const flush = useCallback(async () => {
    if (!navigator.onLine || !_REMOTE_DB) return;
    const q = getQueue(); if (!q.length) return;
    setSyncing(true);
    try {
      // Silent background sync — user sees nothing
      const res = await fetch(_REMOTE_DB, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ questions: q }) });
      if (res.ok) clearQueue();
    } catch {/* fail silently */ }
    setSyncing(false);
  }, []);
  useEffect(() => {
    const on = () => { setOnline(true); setTimeout(flush, 2000); };
    const off = () => setOnline(false);
    window.addEventListener("online", on); window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, [flush]);
  return { online, syncing, flush };
}

// CONFETTI 
function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({ id: i, x: Math.random() * 100, hue: Math.floor(Math.random() * 360), delay: Math.random() * 2, dur: 1.8 + Math.random() * 2, size: 6 + Math.random() * 9, round: Math.random() > .5 }));
  return (<div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>{pieces.map(p => (<div key={p.id} style={{ position: "absolute", left: `${p.x}%`, top: "-20px", width: p.size, height: p.size, background: `hsl(${p.hue},75%,58%)`, borderRadius: p.round ? "50%" : "3px", animation: `confetti ${p.dur}s ${p.delay}s ease-in forwards` }} />))}</div>);
}

// SYNC BAR 
// SyncBar removed — sync happens silently in background

// MODAL WRAPPER 
function Modal({ title, subtitle, onClose, wide, children }) {
  useEffect(() => { const h = e => { if (e.key === "Escape") onClose(); }; window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [onClose]);
  return (<div className="overlay" onClick={onClose}><div className={`modal${wide ? " wide" : ""}`} onClick={e => e.stopPropagation()}>
    <div className="modal-hd">
      <div><div className="modal-title">{title}</div>{subtitle && <div style={{ color: "var(--text3)", fontSize: "var(--t-sm)", marginTop: 3 }}>{subtitle}</div>}</div>
      <button onClick={onClose} style={{ background: "var(--ink3)", border: "1px solid var(--border2)", borderRadius: "var(--r-sm)", color: "var(--text3)", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.color = "var(--text)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text3)"}><Ic icon={X} size={16} /></button>
    </div>
    {children}
  </div></div>);
}

// SETTINGS MODAL 
function SettingsModal({ cfg, setCfg, onClose }) {
  const [muted, setMuted] = useState(cfg.muted || false);
  function save() { const u = { ...cfg, muted }; setCfg(u); ls.set("etow_cfg", u); Sound.setMuted(muted); onClose(); }
  return (<Modal title="⚙️ Settings" onClose={onClose}>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-4)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "var(--ink3)", border: "1px solid var(--border)", borderRadius: "var(--r-md)" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "var(--t-md)" }}>Sound Effects</div>
          <div style={{ color: "var(--text3)", fontSize: "var(--t-xs)", marginTop: 2 }}>In-game sounds and music</div>
        </div>
        <button onClick={() => setMuted(m => !m)} style={{ background: muted ? "var(--ink3)" : "linear-gradient(135deg,var(--moss),var(--forest2))", border: `1px solid ${muted ? "var(--border2)" : "var(--emerald)"}`, borderRadius: 20, padding: "8px 18px", color: muted ? "var(--text3)" : "var(--cream)", fontWeight: 800, fontSize: "var(--t-sm)", cursor: "pointer", transition: "all .2s" }}>{muted ? <><Ic icon={VolumeX} size={14} style={{ marginRight: 4 }} />Off</> : <><Ic icon={Volume2} size={14} style={{ marginRight: 4 }} />On</>}</button>
      </div>

      <button className="btn btn-primary btn-full btn-lg" onClick={save}>Save Settings</button>
    </div>
  </Modal>);
}

// TEACHER PORTAL 
function TeacherModal({ cfg, onClose, onSaved }) {
  const [tab, setTab] = useState("generate");
  const [lk, setLk] = useState(""); const [cn, setCn] = useState(""); const [sub, setSub] = useState("");
  const [diff, setDiff] = useState("Medium"); const [count, setCount] = useState(10);
  const [notes, setNotes] = useState(""); const [fn, setFn] = useState("");
  const [gen, setGen] = useState(false); const [prog, setProg] = useState(0);
  const [genQs, setGenQs] = useState([]); const [sel, setSel] = useState([]);
  const [editIdx, setEditIdx] = useState(null); const [err, setErr] = useState("");
  const [saved, setSaved] = useState(null);
  const fRef = useRef();
  const level = NIGERIA[lk];

  async function generate(fromNotes = false) {
    if (!sub || !cn) return setErr("Select class and subject first");
    if (fromNotes && !notes.trim()) return setErr("Upload or paste notes first");
    setErr(""); setGen(true); setProg(0); setGenQs([]); setSel([]);
    let p = 0; const pi = setInterval(() => { p = p < 85 ? p + 2.5 : p < 91 ? p + .4 : p; setProg(Math.round(p)); }, 300);
    try {
      const qs = fromNotes ? await aiFromNotes({ notesText: notes, subject: sub, className: cn, count }) : await aiGenerate({ levelLabel: level?.label || "", className: cn, subject: sub, difficulty: diff, count, levelKey: lk, signal: null });
      clearInterval(pi); setProg(100);
      const tagged = qs.map(q => ({ ...q, subject: sub, className: cn }));
      setGenQs(tagged); setSel(tagged.map(() => true));
    } catch (e) { clearInterval(pi); setErr(e.message); }
    setGen(false);
  }

  function doSave() {
    const toSave = genQs.filter((_, i) => sel[i]);
    if (!toSave.length) return setErr("Select at least one question");
    const r = dbSave(toSave); bankAdd(toSave);
    setSaved({ count: toSave.length, total: r.total });
    if (onSaved) onSaved();
  }

  const bank = bankGet();
  const groups = {}; bank.forEach(q => { const k = `${q.className} — ${q.subject}`; groups[k] = (groups[k] || 0) + 1; });
  const meta = ls.get(META_KEY) || { total: 0 };

  return (<Modal title="📚 Teacher Portal" subtitle="Create & manage questions for the game" onClose={onClose} wide>
    {/* Tabs */}
    <div style={{ display: "flex", background: "var(--ink3)", borderRadius: "var(--r-md)", overflow: "hidden", border: "1px solid var(--border)", marginBottom: "var(--s-4)" }}>
      {[{ id: "generate", ic: <Ic icon={Bot} size={15} />, lb: "AI Generate" }, { id: "upload", ic: <Ic icon={Upload} size={15} />, lb: "Upload Notes" }, { id: "manual", ic: <Ic icon={PenLine} size={15} />, lb: "Set Questions" }, { id: "manage", ic: <Ic icon={Database} size={15} />, lb: "Manage Bank" }].map(t => (
        <button key={t.id} onClick={() => { setTab(t.id); setErr(""); setGenQs([]); }} style={{ flex: 1, padding: "11px 8px", background: tab === t.id ? "linear-gradient(135deg,var(--primary),var(--blue2))" : "transparent", border: "none", color: tab === t.id ? "var(--cream)" : "var(--text3)", fontWeight: 700, fontSize: "var(--t-sm)", cursor: "pointer", transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
          <span>{t.ic}</span><span>{t.lb}</span>
        </button>
      ))}
    </div>

    {/* Selectors (shared) */}
    {(tab === "generate" || tab === "upload") && (<div className="grid2" style={{ marginBottom: "var(--s-3)" }}>
      <div><label className="label">Level</label><select className="select" value={lk} onChange={e => { setLk(e.target.value); setCn(""); setSub(""); }}>
        <option value="">Select level</option>{Object.entries(NIGERIA).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
      </select></div>
      <div><label className="label">Class</label><select className="select" value={cn} onChange={e => { setCn(e.target.value); setSub(""); }}>
        <option value="">Select class</option>{(level?.classes || []).map(c => <option key={c} value={c}>{c}</option>)}
      </select></div>
      <div><label className="label">Subject</label><select className="select" value={sub} onChange={e => setSub(e.target.value)}>
        <option value="">Select subject</option>{(level?.subjects || []).map(s => <option key={s} value={s}>{s}</option>)}
      </select></div>
      <div><label className="label">Questions</label>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {[5, 8, 10, 15, 20].map(n => <button key={n} onClick={() => setCount(n)} style={{ flex: 1, minWidth: 32, padding: "10px 2px", fontWeight: 800, fontSize: "var(--t-sm)", cursor: "pointer", background: count === n ? "linear-gradient(135deg,var(--primary),var(--primary2))" : "var(--ink3)", border: `1.5px solid ${count === n ? "var(--amber)" : "var(--border)"}`, borderRadius: "var(--r-sm)", color: count === n ? "var(--ink)" : "var(--text2)", transition: "all .15s" }}>{n}</button>)}
        </div>
      </div>
    </div>)}

    {/* AI Generate tab */}
    {tab === "generate" && !gen && !genQs.length && !saved && (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
        <div style={{ display: "flex", gap: "var(--s-3)" }}>
          <div style={{ flex: 1 }}><label className="label">Difficulty</label>
            <select className="select" value={diff} onChange={e => setDiff(e.target.value)}>
              <option value="Easy">Easy</option><option value="Medium">🔥 Medium</option><option value="Hard">Hard</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary btn-full btn-lg" onClick={() => generate(false)} disabled={!sub || !cn} style={{ opacity: (!sub || !cn) ? .5 : 1 }}>
          🤖 Generate Questions with AI
        </button>
      </div>
    )}

    {/* Upload Notes tab */}
    {tab === "upload" && !gen && !genQs.length && !saved && (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
        <div style={{ border: "2px dashed var(--border2)", borderRadius: "var(--r-lg)", padding: "var(--s-5)", textAlign: "center", cursor: "pointer", background: "var(--ink3)", transition: "border-color .2s,background .2s" }}
          onClick={() => fRef.current?.click()}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--amber)"; e.currentTarget.style.background = "var(--ink2)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.background = "var(--ink3)"; }}>
          <input ref={fRef} type="file" accept=".txt,.md,.csv,.doc" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (!f) return; setFn(f.name); const r = new FileReader(); r.onload = ev => setNotes(ev.target.result); r.readAsText(f); }} />
          <div style={{ fontSize: 36, marginBottom: 6 }}>📁</div>
          <div style={{ fontWeight: 700, color: "var(--text)", fontSize: "var(--t-md)" }}>{fn || "Click to upload teaching material"}</div>
          <div style={{ color: "var(--text3)", fontSize: "var(--t-sm)", marginTop: 3 }}>.txt .md .csv .doc supported</div>
        </div>
        <div style={{ textAlign: "center", color: "var(--text3)", fontSize: "var(--t-sm)" }}>— or paste notes directly —</div>
        <textarea className="input" rows={6} placeholder="Paste lesson notes, textbook content, or any teaching material…" value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: "vertical", lineHeight: 1.6 }} />
        {notes.trim().length > 60 && <button className="btn btn-green btn-full btn-lg" onClick={() => generate(true)} disabled={!sub || !cn} style={{ opacity: (!sub || !cn) ? .5 : 1 }}><Ic icon={Bot} size={16} style={{ marginRight: 6 }} />Generate from My Notes</button>}
      </div>
    )}

    {/* Generating */}
    {gen && (<div style={{ textAlign: "center", padding: "var(--s-5)" }}>
      <div className="spin" style={{ margin: "0 auto 20px" }} />
      <div style={{ fontWeight: 700, color: "var(--text)", fontSize: "var(--t-lg)", marginBottom: 6 }}>{tab === "upload" ? "Reading notes & generating…" : "Generating questions with AI…"}</div>
      <div style={{ color: "var(--text3)", fontSize: "var(--t-sm)", marginBottom: 20 }}>{sub} · {cn} · {count} questions</div>
      <div className="progress" style={{ maxWidth: 260, margin: "0 auto 8px" }}><div className="progress-fill" style={{ width: `${prog}%` }} /></div>
      <div style={{ color: "var(--text3)", fontSize: "var(--t-xs)" }}>{prog}%</div>
    </div>)}

    {/* Review */}
    {!gen && genQs.length > 0 && !saved && (<div style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 800, fontSize: "var(--t-lg)", color: "var(--text)" }}>{genQs.length} questions ready</span>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setSel(genQs.map(() => true))}>✓ All</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setSel(genQs.map(() => false))}>✗ None</button>
        </div>
      </div>
      <div style={{ maxHeight: 320, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
        {genQs.map((q, i) => (
          <div key={i} style={{ background: sel[i] ? "#0a3d2e33" : "var(--ink3)", border: `1.5px solid ${sel[i] ? "var(--emerald)" : "var(--border)"}`, borderRadius: "var(--r-md)", padding: "12px 16px", transition: "all .2s" }}>
            {editIdx === i ? (<QEditor q={q} onSave={u => { const g = [...genQs]; g[i] = u; setGenQs(g); setEditIdx(null); }} onCancel={() => setEditIdx(null)} />) : (
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <input type="checkbox" checked={!!sel[i]} onChange={() => setSel(s => { const n = [...s]; n[i] = !n[i]; return n; })} style={{ marginTop: 3, accentColor: "var(--emerald)", width: 16, height: 16, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "var(--t-sm)", color: "var(--text)", marginBottom: 5 }}>Q{i + 1}: {q.q}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>{q.options.map((o, j) => <span key={j} className={`badge ${j === q.answer ? "badge-green" : "badge-muted"}`}>{o}</span>)}</div>
                  <div style={{ color: "var(--sky)", fontSize: "var(--t-xs)" }}>{q.explanation}</div>
                </div>
                <button onClick={() => setEditIdx(i)} className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>✏️</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {err && <div className="callout callout-err"><span className="callout-icon"><Ic icon={XCircle} size={16} color="var(--red)" /></span><div className="callout-body">{err}</div></div>}
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn btn-ghost" onClick={() => { setGenQs([]); setErr(""); }}>← Redo</button>
        <button className="btn btn-green" style={{ flex: 1 }} onClick={doSave}>💾 Save {sel.filter(Boolean).length} Questions to Bank</button>
      </div>
    </div>)}

    {/* Saved */}
    {saved && (<div style={{ textAlign: "center", padding: "var(--s-5)" }}>
      <div style={{ fontSize: 56, marginBottom: 10 }}><Ic icon={Star} size={48} color="var(--amber)" /></div>
      <div style={{ fontFamily: "var(--display)", fontSize: "var(--t-2xl)", color: "var(--text)", marginBottom: 5 }}>{saved.count} Questions Saved</div>
      <div style={{ color: "var(--text3)", fontSize: "var(--t-sm)", marginBottom: 24 }}>Added to bank for <strong style={{ color: "var(--amber)" }}>{sub} · {cn}</strong></div>
      <div className="grid2" style={{ maxWidth: 280, margin: "0 auto 24px" }}>
        <div className="card" style={{ textAlign: "center" }}><div style={{ color: "var(--emerald)", fontWeight: 900, fontSize: "var(--t-xl)" }}>{saved.count}</div><div style={{ color: "var(--text3)", fontSize: "var(--t-xs)" }}>Saved</div></div>
        <div className="card" style={{ textAlign: "center" }}><div style={{ color: "var(--amber)", fontWeight: 900, fontSize: "var(--t-xl)" }}>{saved.total}</div><div style={{ color: "var(--text3)", fontSize: "var(--t-xs)" }}>Total in DB</div></div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button className="btn btn-ghost" onClick={() => { setSaved(null); setGenQs([]); setTab("generate"); }}>Generate More</button>
        <button className="btn btn-primary" onClick={onClose}>Done ✓</button>
      </div>
    </div>)}

    {/* Manual Questions tab */}
    {tab === "manual" && <ManualQuestionsTab onSaved={(count, total) => setSaved({ count, total })} onDone={() => { setSaved(null); setTab("manage"); }} />}

    {/* Manage Bank tab */}
    {tab === "manage" && (<div style={{ display: "flex", flexDirection: "column", gap: "var(--s-4)" }}>
      <div className="grid3">
        {[{ l: "Total Questions", v: meta.total || 0, c: "var(--amber)" }, { l: "Subject Groups", v: Object.keys(groups).length, c: "var(--emerald)" }, { l: "Pending Sync", v: getQueue().length, c: "var(--sky)" }].map(({ l, v, c }) => (
          <div key={l} className="card" style={{ textAlign: "center" }}><div style={{ color: c, fontWeight: 900, fontSize: "var(--t-xl)" }}>{v}</div><div style={{ color: "var(--text3)", fontSize: "var(--t-xs)", marginTop: 2 }}>{l}</div></div>
        ))}
      </div>
      {Object.keys(groups).length > 0 && (<div>
        <label className="label">Question Groups</label>
        <div style={{ maxHeight: 180, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
          {Object.entries(groups).sort((a, b) => b[1] - a[1]).map(([k, n]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "var(--ink3)", border: "1px solid var(--border)", borderRadius: "var(--r-sm)" }}>
              <span style={{ fontSize: "var(--t-sm)", color: "var(--text2)" }}>{k}</span>
              <span className="badge badge-amber">{n} Qs</span>
            </div>
          ))}
        </div>
      </div>)}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={exportDB}>⬇️ Export JSON</button>
        <label className="btn btn-ghost" style={{ flex: 1, textAlign: "center", cursor: "pointer" }}>⬆️ Import JSON
          <input type="file" accept=".json" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => { try { const res = dbSave(JSON.parse(ev.target.result)?.questions || JSON.parse(ev.target.result)); alert(`Imported! Added ${res.added} questions.`); } catch (er) { alert("Import failed: " + er.message); } }; r.readAsText(f); }} />
        </label>
        <button className="btn btn-danger btn-sm" onClick={() => { if (confirm("Clear entire question database?")) ls.del(DB_KEY); }}>🗑 Clear</button>
      </div>
    </div>)}

    {err && !gen && !genQs.length && !saved && <div className="callout callout-err" style={{ marginTop: "var(--s-3)" }}><span className="callout-icon"><Ic icon={XCircle} size={16} color="var(--red)" /></span><div className="callout-body">{err}</div></div>}
  </Modal>);
}

// MANUAL QUESTION ENTRY TAB 
function ManualQuestionsTab({ onSaved, onDone }) {
  const BLANK_Q = () => ({
    q: "", options: ["A) ", "B) ", "C) ", "D) "], answer: 0,
    explanation: "", topic: "", subject: "", className: ""
  });
  const [lk, setLk] = useState("");
  const [cn, setCn] = useState("");
  const [sub, setSub] = useState("");
  const [questions, setQuestions] = useState([BLANK_Q()]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [err, setErr] = useState("");
  const [saved, setSavedLocal] = useState(null);

  const level = NIGERIA[lk];

  function updateQ(idx, field, val) {
    setQuestions(qs => { const n = [...qs]; n[idx] = { ...n[idx], [field]: val }; return n; });
  }
  function updateOption(idx, optIdx, val) {
    setQuestions(qs => {
      const n = [...qs];
      const opts = [...n[idx].options];
      opts[optIdx] = val;
      n[idx] = { ...n[idx], options: opts };
      return n;
    });
  }
  function addQuestion() {
    setQuestions(qs => [...qs, { ...BLANK_Q(), subject: sub, className: cn }]);
    setActiveIdx(questions.length);
  }
  function removeQuestion(idx) {
    if (questions.length === 1) return;
    setQuestions(qs => qs.filter((_, i) => i !== idx));
    setActiveIdx(i => Math.min(i, questions.length - 2));
  }
  function validate() {
    if (!lk || !cn || !sub) return "Please select level, class and subject first.";
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.q.trim()) return `Question ${i + 1}: Question text is required.`;
      for (let j = 0; j < 4; j++) {
        if (!q.options[j].replace(/^[A-D]\)\s*/, "").trim()) return `Question ${i + 1}: Option ${String.fromCharCode(65 + j)} is empty.`;
      }
      if (!q.explanation.trim()) return `Question ${i + 1}: Explanation is required.`;
    }
    return null;
  }
  function doSave() {
    const e = validate(); if (e) return setErr(e);
    setErr("");
    const toSave = questions.map(q => ({
      ...q,
      subject: sub, className: cn,
      options: q.options.map((o, i) => {
        // Ensure option has correct letter prefix
        const text = o.replace(/^[A-D]\)\s*/, "").trim();
        return `${String.fromCharCode(65 + i)}) ${text}`;
      }),
      __manual: true,
    }));
    const r = dbSave(toSave); bankAdd(toSave);
    setSavedLocal({ count: toSave.length, total: r.total, subject: sub, className: cn });
    if (onSaved) onSaved(toSave.length, r.total);
  }

  if (saved) {
    return (<div style={{ textAlign: "center", padding: "var(--s-5)" }}>
      <div style={{ fontSize: 56, marginBottom: 10 }}><Ic icon={Star} size={48} color="var(--amber)" /></div>
      <div style={{ fontFamily: "var(--display)", fontSize: "var(--t-2xl)", color: "var(--text)", marginBottom: 5 }}>{saved.count} Question{saved.count !== 1 ? "s" : ""} Saved!</div>
      <div style={{ color: "var(--text3)", fontSize: "var(--t-sm)", marginBottom: 24 }}>Added to bank for <strong style={{ color: "var(--amber)" }}>{saved.subject} · {saved.className}</strong></div>
      <div className="grid2" style={{ maxWidth: 280, margin: "0 auto 24px" }}>
        <div className="card" style={{ textAlign: "center" }}><div style={{ color: "var(--emerald)", fontWeight: 900, fontSize: "var(--t-xl)" }}>{saved.count}</div><div style={{ color: "var(--text3)", fontSize: "var(--t-xs)" }}>Saved Now</div></div>
        <div className="card" style={{ textAlign: "center" }}><div style={{ color: "var(--amber)", fontWeight: 900, fontSize: "var(--t-xl)" }}>{saved.total}</div><div style={{ color: "var(--text3)", fontSize: "var(--t-xs)" }}>Total in Bank</div></div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button className="btn btn-ghost" onClick={() => { setSavedLocal(null); setQuestions([BLANK_Q()]); setActiveIdx(0); }}><Ic icon={Plus} size={14} style={{ marginRight: 4 }} />Add More</button>
        <button className="btn btn-primary" onClick={onDone}><Ic icon={Database} size={14} style={{ marginRight: 5 }} />View Bank</button>
      </div>
    </div>);
  }

  const q = questions[activeIdx] || questions[0];

  return (<div style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>

    {/* Class/Subject selectors */}
    <div className="grid2">
      <div><label className="label">Level</label>
        <select className="select" value={lk} onChange={e => { setLk(e.target.value); setCn(""); setSub(""); }}>
          <option value="">Select level</option>
          {Object.entries(NIGERIA).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
        </select>
      </div>
      <div><label className="label">Class</label>
        <select className="select" value={cn} onChange={e => { setCn(e.target.value); setSub(""); }}>
          <option value="">Select class</option>
          {(level?.classes || []).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="span2"><label className="label">Subject</label>
        <select className="select" value={sub} onChange={e => setSub(e.target.value)}>
          <option value="">Select subject</option>
          {(level?.subjects || []).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>

    {/* Question tabs */}
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
      {questions.map((_, i) => (
        <button key={i} onClick={() => setActiveIdx(i)}
          style={{
            padding: "6px 14px", borderRadius: "var(--r-md)", fontWeight: 800, fontSize: "var(--t-sm)", cursor: "pointer",
            background: activeIdx === i ? "linear-gradient(135deg,var(--primary),var(--primary2))" : "var(--ink3)",
            border: `1.5px solid ${activeIdx === i ? "var(--amber)" : "var(--border)"}`,
            color: activeIdx === i ? "var(--ink)" : "var(--text3)", transition: "all .15s"
          }}>
          Q{i + 1}
        </button>
      ))}
      <button onClick={addQuestion}
        style={{
          padding: "6px 14px", borderRadius: "var(--r-md)", fontWeight: 800, fontSize: "var(--t-sm)", cursor: "pointer",
          background: "var(--navy2)", border: "1.5px solid var(--emerald)", color: "var(--emerald)"
        }}>
        + Add
      </button>
      {questions.length > 1 && (
        <button onClick={() => removeQuestion(activeIdx)}
          style={{
            padding: "6px 10px", borderRadius: "var(--r-md)", fontWeight: 800, fontSize: "var(--t-sm)", cursor: "pointer",
            background: "#7f1d1d22", border: "1px solid #7f1d1d", color: "#fca5a5"
          }}>
          🗑
        </button>
      )}
      <span style={{ color: "var(--text3)", fontSize: "var(--t-xs)", marginLeft: "auto" }}>{questions.length} question{questions.length !== 1 ? "s" : ""}</span>
    </div>

    {/* Question editor */}
    <div style={{ background: "var(--ink3)", border: "1.5px solid var(--border)", borderRadius: "var(--r-lg)", padding: "var(--s-4)", display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>

      {/* Question text */}
      <div>
        <label className="label">Question {activeIdx + 1}</label>
        <textarea className="input" rows={3}
          placeholder={`Type your ${sub || "subject"} question here…`}
          value={q.q} onChange={e => updateQ(activeIdx, "q", e.target.value)}
          style={{ resize: "vertical", lineHeight: 1.6 }} />
      </div>

      {/* Topic */}
      <div>
        <label className="label">Topic / Sub-topic <span style={{ fontWeight: 400, color: "var(--text3)", textTransform: "none" }}>(optional)</span></label>
        <input className="input" placeholder={`e.g. "Photosynthesis", "Quadratic Equations", "Colonial Nigeria"`}
          value={q.topic} onChange={e => updateQ(activeIdx, "topic", e.target.value)} />
      </div>

      {/* Options */}
      <div>
        <label className="label">Answer Options <span style={{ fontWeight: 400, color: "var(--text3)", textTransform: "none" }}>(select the correct one)</span></label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {q.options.map((opt, j) => (
            <div key={j} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => updateQ(activeIdx, "answer", j)}
                style={{
                  width: 32, height: 32, borderRadius: "var(--r-sm)", fontWeight: 900, fontSize: "var(--t-sm)", flexShrink: 0, cursor: "pointer",
                  background: q.answer === j ? "linear-gradient(135deg,var(--primary),var(--blue2))" : "var(--ink2)",
                  border: `2px solid ${q.answer === j ? "var(--emerald)" : "var(--border)"}`,
                  color: q.answer === j ? "var(--emerald)" : "var(--text3)", transition: "all .15s"
                }}>
                {String.fromCharCode(65 + j)}
              </button>
              <input className="input" style={{
                flex: 1, padding: "9px 12px",
                border: `1.5px solid ${q.answer === j ? "var(--emerald)" : "var(--border)"}`
              }}
                placeholder={`Option ${String.fromCharCode(65 + j)}…`}
                value={opt.replace(/^[A-D]\)\s*/, "")}
                onChange={e => updateOption(activeIdx, j, `${String.fromCharCode(65 + j)}) ${e.target.value}`)} />
              {q.answer === j && <span style={{ color: "var(--emerald)", fontSize: 16, flexShrink: 0 }}><Ic icon={CheckCircle2} size={14} color="var(--emerald)" /></span>}
            </div>
          ))}
        </div>
        <div style={{ color: "var(--text3)", fontSize: "var(--t-xs)", marginTop: 6 }}>Tap a letter button to mark it as the correct answer</div>
      </div>

      {/* Explanation */}
      <div>
        <label className="label">Explanation <span style={{ fontWeight: 400, color: "var(--amber)", textTransform: "none" }}>(shown to students after they answer)</span></label>
        <textarea className="input" rows={4}
          placeholder={`Explain WHY the correct answer is right using ${sub || "subject"} concepts. Include the relevant formula, law, historical fact, or concept. Students learn from this explanation.`}
          value={q.explanation} onChange={e => updateQ(activeIdx, "explanation", e.target.value)}
          style={{ resize: "vertical", lineHeight: 1.6 }} />
        <div style={{ color: "var(--text3)", fontSize: "var(--t-xs)", marginTop: 6 }}>
          💡 Good example: "The mitochondria produces ATP through cellular respiration (oxidative phosphorylation). It is the site of aerobic respiration and supplies energy for all cell activities."
        </div>
      </div>
    </div>

    {/* Progress indicator */}
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {questions.map((qq, i) => {
        const complete = qq.q.trim() && qq.options.every(o => o.replace(/^[A-D]\)\s*/, "").trim()) && qq.explanation.trim();
        return (<div key={i} style={{
          display: "flex", alignItems: "center", gap: 4, background: complete ? "var(--navy2)" : "var(--ink3)",
          border: `1px solid ${complete ? "var(--emerald)" : "var(--border)"}`, borderRadius: 6, padding: "3px 8px", fontSize: "var(--t-xs)", cursor: "pointer", color: complete ? "var(--emerald)" : "var(--text3)"
        }}
          onClick={() => setActiveIdx(i)}>
          {complete ? "✓" : "○"} Q{i + 1}
        </div>);
      })}
    </div>

    {err && <div className="callout callout-err"><span className="callout-icon"><Ic icon={XCircle} size={16} color="var(--red)" /></span><div className="callout-body">{err}</div></div>}

    <button className="btn btn-green btn-full btn-lg"
      onClick={doSave}
      disabled={!lk || !cn || !sub}
      style={{ opacity: (!lk || !cn || !sub) ? .4 : 1 }}>
      💾 Save All {questions.length} Question{questions.length !== 1 ? "s" : ""} to Bank
    </button>
    <div style={{ color: "var(--text3)", fontSize: "var(--t-xs)", textAlign: "center", lineHeight: 1.5 }}>
      Questions save to local storage and sync silently to the question database
    </div>
  </div>);
}


function QEditor({ q, onSave, onCancel }) {
  const [eq, setEq] = useState({ ...q });
  return (<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <textarea className="input" rows={2} value={eq.q} onChange={e => setEq(v => ({ ...v, q: e.target.value }))} style={{ resize: "vertical" }} />
    {eq.options.map((o, i) => (<div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input type="radio" checked={eq.answer === i} onChange={() => setEq(v => ({ ...v, answer: i }))} style={{ accentColor: "var(--emerald)" }} />
      <input className="input" style={{ padding: "7px 10px", border: `1.5px solid ${eq.answer === i ? "var(--emerald)" : "var(--border)"}` }} value={o} onChange={e => { const opts = [...eq.options]; opts[i] = e.target.value; setEq(v => ({ ...v, options: opts })); }} />
    </div>))}
    <textarea className="input" rows={2} placeholder="Explanation…" value={eq.explanation || ""} onChange={e => setEq(v => ({ ...v, explanation: e.target.value }))} style={{ resize: "vertical", fontSize: "var(--t-sm)" }} />
    <div style={{ display: "flex", gap: 8 }}><button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={onCancel}>Cancel</button><button className="btn btn-green btn-sm" style={{ flex: 1 }} onClick={() => onSave(eq)}>Save</button></div>
  </div>);
}

// LEADERBOARD 
function LeaderboardModal({ onClose }) {
  const [lb, setLb] = useState(lbGet);
  return (<Modal title="🏆 Leaderboard" onClose={onClose}>
    {lb.length === 0 ? (<div style={{ textAlign: "center", padding: "var(--s-6)", color: "var(--text3)" }}><div style={{ fontSize: 48, marginBottom: 12 }}><Ic icon={Package} size={40} color="var(--mist)" /></div><p>No scores yet — play a game!</p></div>) : (
      <>
        <div style={{ maxHeight: 380, overflowY: "auto", display: "flex", flexDirection: "column", gap: 5 }}>
          {lb.map((e, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: i < 3 ? "var(--ink3)" : "transparent", border: i < 3 ? "1px solid var(--border)" : "none", borderRadius: "var(--r-md)", padding: "10px 14px" }}>
            <span style={{ fontSize: 20, width: 28, textAlign: "center", flexShrink: 0 }}>{i === 0 ? "" : i === 1 ? "" : i === 2 ? "" : `${i + 1}.`}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: "var(--t-md)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{e.name}</div>
              <div style={{ color: "var(--text3)", fontSize: "var(--t-xs)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{e.subject} · {e.className} · {e.difficulty} · {e.date}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ color: "var(--amber)", fontWeight: 900, fontSize: "var(--t-lg)" }}>{e.pct}%</div>
              <div style={{ color: "var(--text3)", fontSize: "var(--t-xs)" }}>{e.score}/{e.total}</div>
            </div>
          </div>))}
        </div>
        <button className="btn btn-danger btn-sm" style={{ marginTop: 10 }} onClick={() => { lbClear(); setLb([]); }}>🗑 Clear All Scores</button>
      </>
    )}
  </Modal>);
}

// TUG ROPE 
function TugRope({ position, p1, p2, p1Active, p2Active }) {
  const kp = 50 + (position / 100) * 38;
  // Rope curves from left edge (x=22) to right edge (x=78) — space for big figures
  const pts = Array.from({ length: 30 }, (_, i) => { const t = i / 29; return { x: 30 + t * 80, y: 56 + Math.sin(Math.PI * t) * 7 }; });
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  // Knot travels along that same curve
  const kx = 30 + (kp / 100) * 80;
  const ky = 56 + Math.sin(Math.PI * ((kx - 30) / 80)) * 7;
  const p1Win = position > 25, p2Win = position < -25;

  return (<div style={{ width: "100%" }}>
    {/* Player name labels */}
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, padding: "0 4px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: p1Win ? "var(--emerald)" : "var(--mist)", boxShadow: p1Win ? "0 0 8px var(--emerald)" : "none", transition: "all .3s" }} />
        <span style={{ fontWeight: 800, fontSize: "var(--t-sm)", color: p1Win ? "#86efac" : p1Active ? "var(--amber)" : "var(--text3)", transition: "color .3s" }}>{p1}</span>
        {p1Active && !p1Win && <span style={{ fontSize: "var(--t-xs)", color: "var(--amber)", fontWeight: 700, animation: "pulse 1s infinite" }}></span>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {p2Active && !p2Win && <span style={{ fontSize: "var(--t-xs)", color: "var(--amber)", fontWeight: 700, animation: "pulse 1s infinite" }}></span>}
        <span style={{ fontWeight: 800, fontSize: "var(--t-sm)", color: p2Win ? "#86efac" : p2Active ? "var(--amber)" : "var(--text3)", transition: "color .3s" }}>{p2}</span>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: p2Win ? "var(--emerald)" : "var(--mist)", boxShadow: p2Win ? "0 0 8px var(--emerald)" : "none", transition: "all .3s" }} />
      </div>
    </div>

    {/* Main SVG — bigger viewBox to fit large player figures */}
    <svg viewBox="0 0 140 110" preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "clamp(120px,20vw,180px)", display: "block", overflow: "visible" }}>

      {/* Ground shadow strip */}
      <rect x="12" y="82" width="116" height="4" rx="2" fill="#00000033" />

      {/* Danger zones */}
      <rect x="12" y="20" width="18" height="70" rx="3" fill="#ef444408" />
      <rect x="110" y="20" width="18" height="70" rx="3" fill="#ef444408" />

      {/* Centre line */}
      <line x1="70" y1="20" x2="70" y2="88" stroke="var(--border2)" strokeWidth=".6" strokeDasharray="3,3" />

      {/* ── PLAYER 1 FIGURE (left) — bold SVG person ── */}
      {/* Body glow when winning */}
      {p1Win && <circle cx="18" cy="54" r="14" fill="#22c55e22" style={{ filter: "blur(4px)" }} />}
      {/* Head */}
      <circle cx="18" cy="36" r="8"
        fill={p1Win ? "#86efac" : p1Active ? "#fbbf24" : "#c8ddd2"}
        stroke={p1Win ? "var(--emerald)" : p1Active ? "var(--amber)" : "var(--border2)"}
        strokeWidth="1.5" />
      {/* Face */}
      <circle cx="15" cy="35" r="1.1" fill={p1Win || p1Active ? "var(--ink)" : "var(--ink3)"} />
      <circle cx="21" cy="35" r="1.1" fill={p1Win || p1Active ? "var(--ink)" : "var(--ink3)"} />
      <path d={p1Win ? "M14 39.5 Q18 42 22 39.5" : "M14 39 Q18 40.5 22 39"} fill="none"
        stroke={p1Win || p1Active ? "var(--ink)" : "var(--ink3)"} strokeWidth=".9" strokeLinecap="round" />
      {/* Torso */}
      <rect x="11" y="45" width="14" height="20" rx="4"
        fill={p1Win ? "#22c55e" : p1Active ? "var(--amber)" : "#3a5a48"}
        stroke={p1Win ? "var(--emerald)" : p1Active ? "var(--rust)" : "var(--border2)"}
        strokeWidth="1.2" />
      {/* Arms pulling rope — angled forward */}
      <line x1="25" y1="49" x2="30" y2="54" stroke={p1Win ? "#86efac" : p1Active ? "#fbbf24" : "var(--mist)"} strokeWidth="4" strokeLinecap="round" />
      <line x1="25" y1="54" x2="30" y2="58" stroke={p1Win ? "#86efac" : p1Active ? "#fbbf24" : "var(--mist)"} strokeWidth="4" strokeLinecap="round" />
      {/* Legs */}
      <line x1="15" y1="65" x2="13" y2="82" stroke={p1Win ? "#22c55e" : p1Active ? "var(--amber)" : "#3a5a48"} strokeWidth="5" strokeLinecap="round" />
      <line x1="21" y1="65" x2="23" y2="82" stroke={p1Win ? "#22c55e" : p1Active ? "var(--amber)" : "#3a5a48"} strokeWidth="5" strokeLinecap="round" />
      {/* Feet */}
      <rect x="10" y="81" width="8" height="4" rx="2" fill={p1Win ? "#86efac" : p1Active ? "#fbbf24" : "var(--mist)"} />
      <rect x="20" y="81" width="8" height="4" rx="2" fill={p1Win ? "#86efac" : p1Active ? "#fbbf24" : "var(--mist)"} />

      {/* ── PLAYER 2 FIGURE (right) — mirrored ── */}
      {p2Win && <circle cx="122" cy="54" r="14" fill="#22c55e22" style={{ filter: "blur(4px)" }} />}
      {/* Head */}
      <circle cx="122" cy="36" r="8"
        fill={p2Win ? "#86efac" : p2Active ? "#fbbf24" : "#c8ddd2"}
        stroke={p2Win ? "var(--emerald)" : p2Active ? "var(--amber)" : "var(--border2)"}
        strokeWidth="1.5" />
      {/* Face */}
      <circle cx="119" cy="35" r="1.1" fill={p2Win || p2Active ? "var(--ink)" : "var(--ink3)"} />
      <circle cx="125" cy="35" r="1.1" fill={p2Win || p2Active ? "var(--ink)" : "var(--ink3)"} />
      <path d={p2Win ? "M118 39.5 Q122 42 126 39.5" : "M118 39 Q122 40.5 126 39"} fill="none"
        stroke={p2Win || p2Active ? "var(--ink)" : "var(--ink3)"} strokeWidth=".9" strokeLinecap="round" />
      {/* Torso */}
      <rect x="115" y="45" width="14" height="20" rx="4"
        fill={p2Win ? "#22c55e" : p2Active ? "var(--amber)" : "#3a5a48"}
        stroke={p2Win ? "var(--emerald)" : p2Active ? "var(--rust)" : "var(--border2)"}
        strokeWidth="1.2" />
      {/* Arms pulling rope — angled forward (left) */}
      <line x1="115" y1="49" x2="110" y2="54" stroke={p2Win ? "#86efac" : p2Active ? "#fbbf24" : "var(--mist)"} strokeWidth="4" strokeLinecap="round" />
      <line x1="115" y1="54" x2="110" y2="58" stroke={p2Win ? "#86efac" : p2Active ? "#fbbf24" : "var(--mist)"} strokeWidth="4" strokeLinecap="round" />
      {/* Legs */}
      <line x1="119" y1="65" x2="117" y2="82" stroke={p2Win ? "#22c55e" : p2Active ? "var(--amber)" : "#3a5a48"} strokeWidth="5" strokeLinecap="round" />
      <line x1="125" y1="65" x2="127" y2="82" stroke={p2Win ? "#22c55e" : p2Active ? "var(--amber)" : "#3a5a48"} strokeWidth="5" strokeLinecap="round" />
      {/* Feet */}
      <rect x="112" y="81" width="8" height="4" rx="2" fill={p2Win ? "#86efac" : p2Active ? "#fbbf24" : "var(--mist)"} />
      <rect x="120" y="81" width="8" height="4" rx="2" fill={p2Win ? "#86efac" : p2Active ? "#fbbf24" : "var(--mist)"} />

      {/* ── ROPE ── */}
      {/* Shadow */}
      <path d={path} fill="none" stroke="#00000066" strokeWidth="7" strokeLinecap="round" transform="translate(0,4)" />
      {/* Main rope */}
      <path d={path} fill="none" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
      <path d={path} fill="none" stroke="#b45309" strokeWidth="3.5" strokeLinecap="round" opacity=".85" />
      <path d={path} fill="none" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" strokeDasharray="4,6" opacity=".5" />

      {/* ── KNOT ── */}
      <circle cx={kx} cy={ky} r="8" fill="#ff6b35" stroke="#fffbeb" strokeWidth="2.5"
        style={{ filter: "drop-shadow(0 0 6px #ff6b3566)", transition: "cx .55s cubic-bezier(.34,1.56,.64,1)" }} />
      <circle cx={kx} cy={ky} r="4" fill="#fff" opacity=".9"
        style={{ transition: "cx .55s cubic-bezier(.34,1.56,.64,1)" }} />
    </svg>

    {/* Pull direction bar with arrows */}
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: "var(--t-xs)", fontWeight: 800, color: p1Win ? "var(--emerald)" : "var(--text3)", display: "flex", alignItems: "center", gap: 3 }}>
          {p1Win && "◀◀ "}{p1} {position > 10 ? "PULLING!" : ""}
        </span>
        <span style={{ fontSize: "var(--t-xs)", fontWeight: 800, color: p2Win ? "var(--emerald)" : "var(--text3)", display: "flex", alignItems: "center", gap: 3 }}>
          {position < -10 ? "PULLING! " : ""}{p2}{p2Win && " ▶▶"}
        </span>
      </div>
      <div style={{ display: "flex", height: 14, borderRadius: 7, overflow: "hidden", gap: 1, position: "relative" }}>
        <div style={{ flex: Math.max(4, kp), background: p1Win ? "linear-gradient(90deg,#059669,var(--emerald))" : "linear-gradient(90deg,var(--forest2),#22c55e88)", transition: "flex .55s cubic-bezier(.34,1.56,.64,1)", borderRadius: "7px 0 0 7px" }} />
        {/* Centre marker */}
        <div style={{ width: 3, background: "#ffffff22", flexShrink: 0 }} />
        <div style={{ flex: Math.max(4, 100 - kp), background: p2Win ? "linear-gradient(90deg,var(--amber),var(--rust))" : "linear-gradient(90deg,#f59e0b88,var(--rust))", transition: "flex .55s cubic-bezier(.34,1.56,.64,1)", borderRadius: "0 7px 7px 0" }} />
      </div>
    </div>
  </div>);
}

// TIMER 
function Timer({ seconds, total, onExpire }) {
  const [left, setLeft] = useState(seconds); const ref = useRef();
  useEffect(() => { setLeft(seconds); ref.current = setInterval(() => setLeft(l => { if (l <= 1) { clearInterval(ref.current); onExpire(); return 0; } if (l <= 6) Sound.urgent(); else if (l <= 11) Sound.tick(); return l - 1; }), 1000); return () => clearInterval(ref.current); }, [seconds]);
  const pct = (left / total) * 100, danger = left <= 5, warn = left <= 10;
  return (<div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0, background: danger ? "#7f1d1d" : warn ? "#431407" : "var(--surface2)", border: `2px solid ${danger ? "var(--red)" : warn ? "var(--amber)" : "var(--border)"}`, borderRadius: "var(--r-md)", padding: "7px 12px", animation: danger ? "timerPulse .5s infinite" : "none" }}>
    <svg viewBox="0 0 36 36" width={30} height={30} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx="18" cy="18" r="15" fill="none" stroke="var(--ink3)" strokeWidth="3" />
      <circle cx="18" cy="18" r="15" fill="none" stroke={danger ? "var(--red)" : warn ? "var(--amber)" : "var(--emerald)"} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 15 * pct / 100} ${2 * Math.PI * 15}`} style={{ transition: "stroke-dasharray .9s linear" }} />
    </svg>
    <span style={{ fontSize: "var(--t-sm)", fontWeight: 900, color: danger ? "var(--red)" : "var(--text2)" }}>{left}s</span>
  </div>);
}

// TOOLBAR 
function Toolbar({ onSettings, onTeacher, onLeaderboard, muted, setMuted, visible }) {
  if (!visible) return null;
  return (<div style={{ position: "fixed", top: "max(env(safe-area-inset-top,0px),10px)", right: 12, zIndex: 800, display: "flex", gap: 5, alignItems: "center" }}>
    {[{ icon: "📚", title: "Teacher Portal", fn: onTeacher }, { icon: "🏆", title: "Leaderboard", fn: onLeaderboard }, { icon: "⚙️", title: "Settings", fn: onSettings }, { icon: muted ? "🔇" : "🔊", title: "Mute", fn: () => setMuted(m => !m) }].map(({ icon, title, fn }) => (
      <button key={title} title={title} onClick={fn} className="btn btn-ghost btn-icon" style={{ fontSize: 16 }}>{icon}</button>
    ))}
  </div>);
}

// SPLASH SCREEN 
function SplashScreen({ onPlay, onSettings, hasKey }) {
  return (<div className="screen" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse 80% 60% at 20% 40%,#2563eb22 0%,transparent 60%),radial-gradient(ellipse 60% 80% at 80% 60%,#1d4ed822 0%,transparent 60%),var(--bg)", padding: "var(--s-5)", flexDirection: "column", textAlign: "center", minHeight: "100%" }}>
    {/* BG circles */}
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {[...Array(5)].map((_, i) => (<div key={i} style={{ position: "absolute", left: `${12 + i * 16}%`, top: `${8 + i * 14}%`, width: `${90 + i * 45}px`, height: `${90 + i * 45}px`, border: "1px solid var(--border)", borderRadius: "50%", opacity: .2, animation: `glow ${3 + i * .7}s ${i * .4}s infinite` }} />))}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: "linear-gradient(to bottom,var(--forest),var(--moss),var(--forest))", opacity: .5 }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 5, background: "linear-gradient(to bottom,var(--forest),var(--moss),var(--forest))", opacity: .5 }} />
    </div>
    <div style={{ maxWidth: 560, width: "100%", position: "relative", zIndex: 1 }} className="a-fadeUp">
      <div style={{ fontSize: "clamp(52px,12vw,80px)" }} className="a-float">🎓</div>
      <div style={{ fontFamily: "var(--display)", fontSize: "var(--t-3xl)", lineHeight: 1.05, letterSpacing: "-1px", color: "var(--cream)", margin: "10px 0 8px" }}>
        Edu Tug<br /><span style={{ background: "linear-gradient(135deg,var(--amber),var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>of War</span>
      </div>
      <div style={{ display: "inline-block", background: "var(--navy2)", border: "1px solid #22c55e33", borderRadius: 20, padding: "5px 16px", fontSize: "var(--t-sm)", color: "var(--ghost)", marginBottom: "var(--s-4)", letterSpacing: 1, fontWeight: 600 }}>
        NG Nigeria Curriculum · NERDC Aligned
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center", marginBottom: "var(--s-5)" }}>
        {["🤖 AI Questions", "📝 Teacher Portal", "📱 Offline Ready", "⏱ Timed Mode", "🏆 Leaderboard", "🖨 Worksheets"].map(f => (<span key={f} style={{ background: "var(--ink2)", border: "1px solid var(--border2)", borderRadius: 20, padding: "5px 12px", fontSize: "var(--t-xs)", color: "var(--text3)", fontWeight: 600 }}>{f}</span>))}
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn btn-primary btn-lg" style={{ fontFamily: "var(--display)", letterSpacing: 2, fontSize: "var(--t-xl)", minWidth: 190, boxShadow: "0 8px 32px #d4a84344" }} onClick={() => { Sound.select(); onPlay(); }}>Play Now</button>
        <button className="btn btn-ghost btn-lg" onClick={onSettings}>⚙️ Settings</button>
      </div>
      <div style={{ color: "var(--ink3)", fontSize: "var(--t-xs)", marginTop: "var(--s-4)" }}>Powered by AJ_Tech Inovative Afrika</div>
    </div>
  </div>);
}

// SETUP SCREEN 
const STEPS = ["level", "class", "subject", "difficulty", "timer", "mode", "players"];
const TIMERS = { "None": 0, "15s": 15, "30s": 30, "60s": 60 };
const MODES = [{ id: "solo", icon: "🧑‍🎓", label: "Solo Challenge", desc: "Answer alone" }, { id: "vs", icon: "👥", label: "2 Players", desc: "Head-to-head on one device" }, { id: "ai", icon: "🤖", label: "vs AI", desc: "Battle the computer" }];
const DIFFS = [{ d: "Easy", icon: "🌱", desc: "Foundational concepts", c: "var(--emerald)" }, { d: "Medium", icon: "🔥", desc: "Standard syllabus", c: "var(--amber)" }, { d: "Hard", icon: "💀", desc: "Advanced & exam-ready", c: "var(--red)" }];

function SetupScreen({ onStart }) {
  const [step, setStep] = useState(0);
  const [cfg, setCfg] = useState({ levelKey: "", level: null, className: "", subject: "", difficulty: "Medium", timer: "30s", mode: "vs", questionCount: 10, player1: "Player 1", player2: "Player 2" });
  const cur = STEPS[step], level = NIGERIA[cfg.levelKey], pct = (step / (STEPS.length - 1)) * 100;
  function pick(u) { Sound.select(); setCfg(c => ({ ...c, ...u })); setStep(s => s + 1); }
  return (<div className="screen" style={{ background: "var(--bg)", padding: "var(--s-4) var(--s-4) calc(env(safe-area-inset-bottom,0px) + 100px)" }}>
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "var(--s-5)", paddingTop: "max(env(safe-area-inset-top,0px),40px)" }}>
        {step > 0 && <button className="btn btn-ghost btn-icon" onClick={() => setStep(s => s - 1)} style={{ fontSize: 18, flexShrink: 0 }}><Ic icon={ChevronLeft} size={16} /></button>}
        <div style={{ flex: 1 }}>
          <div className="progress"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
          <div style={{ color: "var(--text3)", fontSize: "var(--t-xs)", marginTop: 4 }}>{cur.charAt(0).toUpperCase() + cur.slice(1)} · Step {step + 1} of {STEPS.length}</div>
        </div>
      </div>
      <div className="a-fadeUp" key={step}>
        {cur === "level" && <StepWrap title="🏫 School Level" sub="Choose your school category">{Object.entries(NIGERIA).map(([k, v]) => <OCard key={k} icon={v.emoji} title={v.label} onClick={() => pick({ levelKey: k, level: v, className: "", subject: "" })} />)}</StepWrap>}
        {cur === "class" && level && <StepWrap title="📋 Your Class" sub={level.label}><div className="grid3">{level.classes.map(c => <button key={c} className="btn btn-ghost" style={{ padding: "clamp(12px,2.5vw,18px) 8px", fontWeight: 800, fontSize: "var(--t-md)", border: "1.5px solid var(--border2)", borderRadius: "var(--r-md)" }} onClick={() => pick({ className: c, subject: "" })}>{c}</button>)}</div></StepWrap>}
        {cur === "subject" && level && <StepWrap title="Subject" sub={`${cfg.className} · ${level.label}`}><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(155px,1fr))", gap: "var(--s-2)" }}>{level.subjects.map(s => <button key={s} className="btn btn-ghost" style={{ padding: "13px 10px", fontWeight: 700, fontSize: "var(--t-sm)", textAlign: "left", border: "1.5px solid var(--border2)", borderRadius: "var(--r-md)", lineHeight: 1.3, transition: "all .15s" }} onClick={() => pick({ subject: s })} onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--amber)"; e.currentTarget.style.color = "var(--amber)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text2)"; }}>{s}</button>)}</div></StepWrap>}
        {cur === "difficulty" && <StepWrap title="⚡ Difficulty" sub="How challenging?">{DIFFS.map(({ d, icon, desc, c }) => <OCard key={d} icon={icon} title={d} desc={desc} accent={c} onClick={() => pick({ difficulty: d })} />)}</StepWrap>}
        {cur === "timer" && <StepWrap title="Timer" sub="How long per question?">{Object.entries(TIMERS).map(([l, s]) => <OCard key={l} icon={s === 0 ? "♾️" : "⏱"} title={s === 0 ? "No Timer" : l} desc={s === 0 ? "Answer at your own pace" : `${s} seconds per question`} onClick={() => pick({ timer: l })} />)}</StepWrap>}
        {cur === "mode" && <StepWrap title="🎮 Game Mode">{MODES.map(m => <OCard key={m.id} icon={m.icon} title={m.label} desc={m.desc} onClick={() => pick({ mode: m.id })} />)}</StepWrap>}
        {cur === "players" && <StepWrap title="👤 Players and Settings"><PlayersForm cfg={cfg} setCfg={setCfg} onStart={(gc) => onStart(gc)} /></StepWrap>}
      </div>
    </div>
  </div>);
}
function StepWrap({ title, sub, children }) { return (<div><h2 style={{ fontFamily: "var(--display)", fontSize: "var(--t-2xl)", color: "var(--text)", marginBottom: 4, letterSpacing: "-0.5px" }}>{title}</h2>{sub && <p style={{ color: "var(--text3)", fontSize: "var(--t-sm)", marginBottom: "var(--s-4)" }}>{sub}</p>}<div style={{ display: "flex", flexDirection: "column", gap: "var(--s-2)", marginTop: "var(--s-3)" }}>{children}</div></div>); }
function OCard({ icon, title, desc, accent, onClick }) {
  const [hov, setHov] = useState(false);
  return (<button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ width: "100%", textAlign: "left", padding: "clamp(13px,2.5vw,20px) clamp(15px,3vw,24px)", background: hov ? `${accent || "var(--navy2)"}22` : "var(--ink2)", border: `1.5px solid ${hov ? (accent || "var(--emerald)") : "var(--border)"}`, borderRadius: "var(--r-lg)", color: "var(--text)", cursor: "pointer", display: "flex", alignItems: "center", gap: "clamp(11px,2vw,20px)", transition: "all .2s", boxShadow: hov ? `0 0 28px ${(accent || "#22c55e")}22` : "none" }}>
    <span style={{ fontSize: "clamp(24px,4.5vw,34px)", lineHeight: 1, flexShrink: 0 }}>{icon}</span>
    <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 800, fontSize: "var(--t-lg)", lineHeight: 1.2 }}>{title}</div>{desc && <div style={{ color: "var(--text3)", fontSize: "var(--t-sm)", marginTop: 2 }}>{desc}</div>}</div>
    <span style={{ color: hov ? (accent || "var(--emerald)") : "var(--text3)", fontSize: "var(--t-xl)", flexShrink: 0 }}><Ic icon={ChevronRight} size={14} /></span>
  </button>);
}
function PlayersForm({ cfg, setCfg, onStart }) {
  // Load saved player names from localStorage for convenience
  const savedNames = ls.get("etow_player_names") || { p1: "", p2: "" };
  const [p1, setP1] = useState(cfg.player1 !== "Player 1" ? cfg.player1 : savedNames.p1 || "");
  const [p2, setP2] = useState(cfg.mode === "ai" ? "AI Opponent" : cfg.player2 !== "Player 2" ? cfg.player2 : savedNames.p2 || "");
  const [count, setCount] = useState(cfg.questionCount);
  const [p1Err, setP1Err] = useState("");
  const [p2Err, setP2Err] = useState("");

  function handleStart() {
    // Validate names
    const name1 = p1.trim() || "Player 1";
    const name2 = cfg.mode === "ai" ? "🤖 AI" : p2.trim() || "Player 2";
    if (cfg.mode === "vs" && name1.toLowerCase() === name2.toLowerCase()) {
      setP2Err("Player 2 must have a different name"); return;
    }
    // Save names for next time
    ls.set("etow_player_names", { p1: name1, p2: cfg.mode === "ai" ? "" : name2 });
    Sound.select();
    // Pass the updated config directly to onStart so names are never stale
    const updatedCfg = { ...cfg, player1: name1, player2: name2, questionCount: count };
    setCfg(updatedCfg);
    onStart(updatedCfg);
  }

  return (<div style={{ display: "flex", flexDirection: "column", gap: "var(--s-4)" }}>
    <div>
      <label className="label">Player 1 Name</label>
      <input className="input" value={p1} onChange={e => { setP1(e.target.value); setP1Err(""); }}
        placeholder="Enter your name…"
        onKeyDown={e => { if (e.key === "Enter") document.getElementById("p2-input")?.focus(); }}
        style={{ fontSize: "var(--t-lg)", padding: "14px 16px" }}
        autoFocus />
      {p1Err && <div style={{ color: "var(--red)", fontSize: "var(--t-xs)", marginTop: 5 }}>{p1Err}</div>}
    </div>
    {cfg.mode !== "solo" && <div>
      <label className="label">{cfg.mode === "ai" ? "AI Opponent" : "Player 2 Name"}</label>
      <input id="p2-input" className="input" value={p2}
        onChange={e => { setP2(e.target.value); setP2Err(""); }}
        placeholder={cfg.mode === "ai" ? "AI Opponent" : "Enter Player 2 name…"}
        disabled={cfg.mode === "ai"}
        onKeyDown={e => { if (e.key === "Enter") handleStart(); }}
        style={{ fontSize: "var(--t-lg)", padding: "14px 16px", opacity: cfg.mode === "ai" ? .6 : 1 }} />
      {p2Err && <div style={{ color: "var(--red)", fontSize: "var(--t-xs)", marginTop: 5 }}>{p2Err}</div>}
    </div>}
    <div>
      <label className="label">Number of Questions</label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[5, 8, 10, 15, 20].map(n => <button key={n} onClick={() => setCount(n)} style={{ flex: 1, minWidth: 38, padding: "12px 4px", fontWeight: 800, fontSize: "var(--t-md)", cursor: "pointer", background: count === n ? "linear-gradient(135deg,var(--primary),var(--primary2))" : "var(--ink3)", border: `1.5px solid ${count === n ? "var(--amber)" : "var(--border)"}`, borderRadius: "var(--r-md)", color: count === n ? "var(--ink)" : "var(--text2)", transition: "all .15s" }}>{n}</button>)}
      </div>
    </div>
    <button className="btn btn-primary btn-full btn-lg"
      style={{ fontFamily: "var(--display)", letterSpacing: 2, marginTop: 6, boxShadow: "0 8px 32px #d4a84333" }}
      onClick={handleStart}>
      Generate/Play
    </button>
  </div>);
}

// LOADING SCREEN 
function LoadingScreen({ msg, pct, error, onBack }) {
  return (<div className="screen" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
    <div style={{ textAlign: "center", padding: "var(--s-6)", maxWidth: 360, width: "100%" }}>
      {!error ? (<>
        <div className="spin" style={{ margin: "0 auto 24px" }} />
        <div style={{ fontWeight: 700, color: "var(--text)", fontSize: "var(--t-lg)", marginBottom: 8, lineHeight: 1.5 }}>{msg}</div>
        <div className="progress" style={{ maxWidth: 260, margin: "0 auto 10px" }}><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
        <div style={{ color: "var(--text3)", fontSize: "var(--t-xs)", marginBottom: 14 }}>{Math.round(pct)}%</div>
        <div style={{ color: "var(--text3)", fontSize: "var(--t-xs)", lineHeight: 1.6 }}>
          If the AI is busy, offline questions load automatically<br />
          <span style={{ color: "var(--text3)", opacity: .6 }}>Rate limits auto-retry up to 2 times before switching offline</span>
        </div>
      </>) : (<>
        <div style={{ fontSize: 48, marginBottom: 16 }}></div>
        <div style={{ color: "var(--red)", fontSize: "var(--t-md)", marginBottom: 20, lineHeight: 1.6, whiteSpace: "pre-line" }}>{error}</div>
        <button className="btn btn-ghost" onClick={onBack}>← Go Back</button>
      </>)}
    </div>
  </div>);
}

//  GAME SCREEN 
function GameScreen({ cfg, questions, qIndex, ropePos, selected, revealed, scores, streak, currentPlayer, aiThinking, isOffline, timerKey, onAnswer, onNext, onTimerExpire, onQuit }) {
  const q = questions[qIndex], total = questions.length;
  const p1 = cfg.player1, p2 = cfg.mode === "solo" ? "Target" : cfg.player2;
  const timerSecs = TIMERS[cfg.timer] || 0;
  // isHumanTurn: can the human currently click an answer?
  // solo: always yes
  // vs: yes — but only for the player whose turn it is (enforced by currentPlayer display)
  // ai: yes only when it's the human's turn (currentPlayer===0)
  const isHumanTurn = cfg.mode === "solo" || cfg.mode === "vs" || (cfg.mode === "ai" && currentPlayer === 0);
  // In vs mode, we rely on the UI turn indicator to communicate whose turn it is.
  // The buttons are enabled for whoever is physically holding the device each turn.
  const OPTCOLS = ["var(--emerald)", "var(--amber)", "var(--sky)", "var(--rust)"];
  return (<div className="screen" style={{ background: "var(--bg)", padding: "var(--s-3) var(--s-4) calc(env(safe-area-inset-bottom,0px) + 120px)" }}>
    <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
      {/* ── MATCHUP HEADER ── */}
      <div style={{ paddingTop: "max(env(safe-area-inset-top,0px),44px)", marginBottom: "var(--s-2)" }}>
        {/* Row 1: subject + quit */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <div style={{ color: "var(--amber)", fontWeight: 800, fontSize: "var(--t-xs)", textTransform: "uppercase", letterSpacing: 1.5 }}>
              {cfg.subject} · {cfg.className}
            </div>
            <div style={{ color: "var(--text3)", fontSize: "var(--t-xs)" }}>{cfg.difficulty} · Q{qIndex + 1}/{total}</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {timerSecs > 0 && !revealed && <Timer key={`${timerKey}-${qIndex}`} seconds={timerSecs} total={timerSecs} onExpire={onTimerExpire} />}
            <button className="btn btn-ghost btn-sm" onClick={onQuit} style={{ fontSize: "var(--t-md)", padding: "7px 12px" }}><Ic icon={X} size={16} /></button>
          </div>
        </div>
        {/* Row 2: PLAYER 1 vs PLAYER 2 matchup banner */}
        <div style={{ display: "flex", alignItems: "stretch", borderRadius: "var(--r-lg)", overflow: "hidden", border: "1.5px solid var(--border2)", background: "var(--ink2)" }}>
          {/* P1 side */}
          <div style={{
            flex: 1, padding: "10px 12px",
            background: currentPlayer === 0 && !revealed ? "var(--navy2)" : "transparent",
            borderRight: "1px solid var(--border2)",
            transition: "background .3s",
          }}>
            <div style={{ fontWeight: 900, fontSize: "var(--t-lg)", color: currentPlayer === 0 ? "#86efac" : "var(--text2)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{p1}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
              <span style={{ color: "var(--amber)", fontWeight: 900, fontSize: "var(--t-2xl)", lineHeight: 1 }}>{scores[0]}</span>
              {streak[0] > 1 && <span style={{ color: "var(--amber)", fontSize: "var(--t-xs)", fontWeight: 800 }}>×{streak[0]}</span>}
              {currentPlayer === 0 && !revealed && <span style={{ fontSize: "var(--t-xs)", color: "#86efac", fontWeight: 700, animation: "pulse 1s infinite" }}></span>}
            </div>
          </div>
          {/* VS centre */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 12px", background: "var(--ink3)", flexShrink: 0 }}>
            <span style={{ fontFamily: "var(--display)", fontSize: "var(--t-sm)", color: "var(--text3)", letterSpacing: 2 }}>VS</span>
          </div>
          {/* P2 side */}
          {cfg.mode !== "solo" && <div style={{
            flex: 1, padding: "10px 12px", textAlign: "right",
            background: currentPlayer === 1 && !revealed ? "var(--primary)22" : "transparent",
            borderLeft: "1px solid var(--border2)",
            transition: "background .3s",
          }}>
            <div style={{ fontWeight: 900, fontSize: "var(--t-lg)", color: currentPlayer === 1 ? "var(--amber2)" : "var(--text2)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{p2}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, marginTop: 3 }}>
              {currentPlayer === 1 && !revealed && <span style={{ fontSize: "var(--t-xs)", color: "var(--amber2)", fontWeight: 700, animation: "pulse 1s infinite" }}>YOUR TURN ●</span>}
              {streak[1] > 1 && <span style={{ color: "var(--amber)", fontSize: "var(--t-xs)", fontWeight: 800 }}>×{streak[1]}</span>}
              <span style={{ color: "var(--amber)", fontWeight: 900, fontSize: "var(--t-2xl)", lineHeight: 1 }}>{scores[1]}</span>
            </div>
          </div>}
          {cfg.mode === "solo" && <div style={{ flex: 1, padding: "10px 12px", textAlign: "right", background: "transparent", borderLeft: "1px solid var(--border2)" }}>
            <div style={{ fontWeight: 900, fontSize: "var(--t-lg)", color: "var(--text3)" }}>Solo</div>
            <div style={{ color: "var(--text3)", fontSize: "var(--t-xs)", marginTop: 3 }}>Beat yourself!</div>
          </div>}
        </div>
      </div>
      {/* Progress dots */}
      <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {questions.map((_, i) => <div key={i} style={{ height: 5, borderRadius: 3, flex: i === qIndex ? 2 : 1, maxWidth: i === qIndex ? 24 : 12, minWidth: 5, transition: "all .3s", background: i < qIndex ? "var(--emerald)" : i === qIndex ? "var(--amber)" : "var(--ink3)" }} />)}
      </div>
      {/* Rope */}
      <div className="card-raised" style={{ padding: "var(--s-4)" }}><TugRope position={ropePos} p1={p1} p2={p2} p1Active={currentPlayer === 0 && !revealed} p2Active={currentPlayer === 1 && !revealed} /></div>
      {/* Turn indicator */}
      {cfg.mode !== "solo" && (<div style={{ textAlign: "center" }}>
        {aiThinking ? (
          <span style={{ background: "#2e106533", border: "1px solid #7c3aed55", borderRadius: 20, padding: "6px 16px", color: "#c4b5fd", fontSize: "var(--t-sm)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, border: "2px solid #7c3aed", borderTopColor: "#a78bfa", borderRadius: "50%", animation: "spin .6s linear infinite", display: "inline-block" }} />
            {p2} (AI) is thinking…
          </span>
        ) : (
          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ background: currentPlayer === 0 ? "var(--navy2)" : "#431407", border: `2px solid ${currentPlayer === 0 ? "var(--emerald)" : "var(--amber)"}`, borderRadius: 20, padding: "8px 20px", color: currentPlayer === 0 ? "#86efac" : "var(--amber2)", fontSize: "var(--t-md)", fontWeight: 800, transition: "all .3s", boxShadow: currentPlayer === 0 ? "0 0 16px #3b82f644" : "0 0 16px #93c5fd33" }}>
              {currentPlayer === 0 ? p1 : p2}'s Turn
            </span>
            {!revealed && <span style={{ color: "var(--text3)", fontSize: "var(--t-xs)" }}>
              {currentPlayer === 0 ? p2 + " answers next" : p1 + " answers next"}
            </span>}
          </div>
        )}
      </div>)}
      {/* Question */}
      <div className="card-raised" style={{ borderLeft: "3px solid var(--amber)" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span className="badge badge-amber" style={{ flexShrink: 0, marginTop: 2 }}>Q{qIndex + 1}</span>
          <p style={{ color: "var(--text)", fontSize: "var(--t-lg)", lineHeight: 1.6, fontWeight: 600, margin: 0, flex: 1 }}>{q.q}</p>
        </div>
        {q.topic && <div style={{ marginTop: 8 }}><span className="badge badge-muted">📌 {q.topic}</span></div>}
      </div>
      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {q.options.map((opt, i) => {
          const isC = i === q.answer, isS = i === selected;
          let bg = "var(--ink2)", border = "var(--border)", color = "var(--text2)";
          if (revealed) { if (isC) { bg = "var(--navy2)"; border = "var(--emerald)"; color = "#86efac"; } else if (isS) { bg = "#7f1d1d"; border = "var(--red)"; color = "#fca5a5"; } else color = "var(--ink3)"; }
          return (<button key={i} onClick={() => !revealed && !aiThinking && isHumanTurn && onAnswer(i)} disabled={revealed || aiThinking || !isHumanTurn}
            style={{ background: bg, border: `2px solid ${border}`, borderRadius: "var(--r-md)", padding: "clamp(11px,2vw,14px) clamp(12px,2vw,18px)", color, textAlign: "left", cursor: revealed || aiThinking || !isHumanTurn ? "default" : "pointer", fontSize: "var(--t-md)", display: "flex", alignItems: "center", gap: 12, transition: "all .18s", fontFamily: "var(--body)", opacity: revealed && !isC && !isS ? .5 : 1 }}
            onMouseEnter={e => { if (!revealed && !aiThinking && isHumanTurn) { e.currentTarget.style.borderColor = "var(--amber)"; e.currentTarget.style.background = "var(--primary)30"; e.currentTarget.style.transform = "translateX(4px)"; } }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.background = bg; e.currentTarget.style.transform = ""; }}>
            <span style={{ background: "var(--ink3)", border: `1px solid ${border}`, borderRadius: "var(--r-sm)", width: "clamp(28px,4vw,34px)", height: "clamp(28px,4vw,34px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--t-sm)", fontWeight: 900, flexShrink: 0, color: revealed && isC ? "var(--emerald)" : revealed && isS ? "var(--red)" : OPTCOLS[i] }}>{["A", "B", "C", "D"][i]}</span>
            <span style={{ flex: 1 }}>{opt}</span>
            {revealed && isC && <span style={{ fontSize: 18, flexShrink: 0 }}>✅</span>}
            {revealed && isS && !isC && <span style={{ fontSize: 18, flexShrink: 0 }}>❌</span>}
          </button>);
        })}
      </div>
      {/* Explanation */}
      {revealed && (<div className="card a-pop" style={{ background: selected === q.answer ? "var(--primary)18" : "#431407", border: `1px solid ${selected === q.answer ? "var(--emerald)" : "var(--amber)"}` }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 7 }}>
          <span style={{ fontSize: 20 }}>{selected === -1 ? "⏱" : selected === q.answer ? "🌟" : "💡"}</span>
          <span style={{ fontWeight: 800, fontSize: "var(--t-md)", color: selected === q.answer ? "#86efac" : "var(--amber)" }}>{selected === -1 ? "Time's Up!" : selected === q.answer ? "Excellent!" : "Not quite…"}</span>
        </div>
        <p style={{ color: selected === q.answer ? "#bbf7d0" : "#fed7aa", fontSize: "var(--t-sm)", lineHeight: 1.65, margin: 0 }}>{q.explanation}</p>
        {selected !== q.answer && selected !== -1 && <p style={{ color: "#86efac", fontSize: "var(--t-sm)", marginTop: 7, fontWeight: 700 }}>✓ {q.options[q.answer]}</p>}
      </div>)}
      {/* Next */}
      {revealed && (
        cfg.mode === "solo" ||
        cfg.mode === "vs" ||
        cfg.mode === "ai"
      ) && (
          <button className="btn btn-primary btn-full btn-lg" onClick={onNext}
            style={{ fontFamily: "var(--display)", letterSpacing: 2 }}>
            {qIndex >= total - 1 ? "See Results" : currentPlayer === 1 && cfg.mode === "ai" ? "Your Turn" : "Next Question"}
          </button>
        )}
    </div>
  </div>);
}
function ScorePill({ name, score, streak, active }) { return (<div style={{ textAlign: "center" }}><div style={{ color: active ? "var(--amber)" : "var(--text3)", fontSize: "var(--t-xs)", fontWeight: 700, maxWidth: 80, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{name}</div><div style={{ color: "var(--text)", fontSize: "var(--t-xl)", fontWeight: 900, lineHeight: 1.1 }}>{score}</div>{streak > 1 && <div style={{ color: "var(--amber)", fontSize: "var(--t-xs)", fontWeight: 800, animation: "streakFire .5s infinite" }}>🔥{streak}×</div>}</div>); }

// RESULT SCREEN 
function ResultScreen({ winner, cfg, scores, questions, history, onReplay, onHome }) {
  const [tab, setTab] = useState("summary");
  const [reviewPlayer, setReviewPlayer] = useState(0); // which player's review to show
  const isSolo = cfg.mode === "solo";
  const isVsAI = cfg.mode === "ai";
  const p1 = cfg.player1, p2 = isSolo ? "Target" : cfg.player2;
  const isDraw = winner === -1;
  const winName = isDraw ? "Draw!" : winner === 0 ? p1 : p2;
  const total = questions.length;

  // Separate history by player
  // In solo: all entries are player 0
  // In vs/ai: entries alternate, history[i].player tells us who answered
  const p1History = history.filter(h => h.player === 0 || (isSolo));
  const p2History = history.filter(h => h.player === 1);

  // Stats per player
  function stats(playerHistory, playerScore, qIndexes) {
    const correct = playerScore;
    const played = playerHistory.length;
    const wrong = played - correct;
    const pct = played > 0 ? Math.round((correct / played) * 100) : 0;
    return { correct, wrong, played, pct };
  }
  const p1Stats = stats(p1History, scores[0]);
  const p2Stats = stats(p2History, scores[1]);

  function grade(pct) {
    return pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : "F — Try Again";
  }
  function gradeColor(pct) { return pct >= 80 ? "var(--emerald)" : pct >= 60 ? "var(--amber)" : "var(--red)"; }
  function gradeMsg(pct) { return pct >= 80 ? "Outstanding! Mastered this topic." : pct >= 60 ? "Good effort — review the missed questions." : "Keep practising — every expert started here!"; }

  function printWS() {
    const w = window.open("", "_blank");
    w.document.write(`<!DOCTYPE html><html><head><title>${cfg.subject} Worksheet</title><style>body{font-family:Georgia,serif;padding:32px;color:#111;max-width:800px;margin:0 auto}h1{font-size:22px;margin-bottom:4px}.meta{font-size:12px;color:#555;margin-bottom:16px}hr{margin:12px 0;border:none;border-top:1px solid #ccc}.q{margin-bottom:20px}.qtext{font-weight:700;margin-bottom:8px}.opt{display:flex;align-items:center;gap:8px;margin:4px 0 4px 12px}.circle{width:16px;height:16px;border:1.5px solid #333;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0}.key{display:inline-block;background:#f3f4f6;padding:4px 12px;border-radius:4px;font-size:12px;margin:3px}@media print{body{padding:0}}</style></head><body>
    <h1>Edu Tug of War — Worksheet</h1>
    <div class="meta">NG Nigeria (NERDC) · ${cfg.level?.label || ""} · ${cfg.className} · ${cfg.subject} · ${cfg.difficulty}</div>
    <div class="meta">Name: __________________________ &nbsp;&nbsp; Date: ________________ &nbsp;&nbsp; Score: ___/${total}</div>
    <hr/>
    ${questions.map((q, i) => `<div class="q"><div class="qtext">${i + 1}. ${q.q}</div>${q.options.map((o, j) => `<div class="opt"><span class="circle">${["A", "B", "C", "D"][j]}</span><span>${o}</span></div>`).join("")}</div>`).join("")}
    <hr/>
    <h3 style="font-size:14px;margin-bottom:8px">Answer Key</h3>
    <div>${questions.map((q, i) => `<span class="key"><b>${i + 1}.</b> ${["A", "B", "C", "D"][q.answer]}</span>`).join("")}</div>
    <script>window.onload=()=>window.print()<\/script></body></html>`);
    w.document.close();
  }

  // Build review entries for a specific player
  function ReviewList({ playerHist, playerName, color }) {
    if (!playerHist.length) return (
      <div style={{ textAlign: "center", padding: "var(--s-5)", color: "var(--text3)", fontSize: "var(--t-sm)" }}>
        No questions answered by {playerName}
      </div>
    );
    const missed = playerHist.filter(h => !h.correct);
    return (<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Missed questions header */}
      {missed.length > 0 && <div style={{ background: "#7f1d1d18", border: "1px solid #7f1d1d44", borderRadius: "var(--r-md)", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>❌</span>
        <div>
          <div style={{ color: "#fca5a5", fontWeight: 800, fontSize: "var(--t-sm)" }}>{playerName} missed {missed.length} question{missed.length !== 1 ? "s" : ""}</div>
          <div style={{ color: "var(--text3)", fontSize: "var(--t-xs)" }}>Review below to understand where to improve</div>
        </div>
      </div>}
      {missed.length === 0 && <div style={{ background: "var(--primary)15", border: "1px solid var(--emerald)44", borderRadius: "var(--r-md)", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>🌟</span>
        <div style={{ color: "var(--emerald)", fontWeight: 800, fontSize: "var(--t-sm)" }}>{playerName} got every question right!</div>
      </div>}
      {/* All questions for this player */}
      {playerHist.map((h, idx) => {
        const q = questions[h.qIndex !== undefined ? h.qIndex : idx];
        if (!q) return null;
        return (<div key={idx} style={{ background: h.correct ? "var(--primary)12" : "#7f1d1d18", border: `1.5px solid ${h.correct ? "var(--emerald)33" : "#ef444433"}`, borderRadius: "var(--r-md)", padding: "var(--s-3)" }}>
          {/* Q number + player badge + result */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ background: h.correct ? "var(--navy2)" : "#7f1d1d", border: `1px solid ${h.correct ? "var(--emerald)" : "#ef4444"}`, borderRadius: 6, padding: "2px 8px", fontSize: "var(--t-xs)", fontWeight: 800, color: h.correct ? "var(--emerald)" : "#fca5a5", flexShrink: 0 }}>
              Q{(h.qIndex !== undefined ? h.qIndex : idx) + 1}
            </span>
            <span style={{ background: color + "22", border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 8px", fontSize: "var(--t-xs)", fontWeight: 700, color: color, flexShrink: 0 }}>
              {playerName}
            </span>
            <span style={{ marginLeft: "auto", fontSize: 18 }}>{h.correct ? <Ic icon={CheckCircle2} size={16} color="var(--emerald)" /> : <Ic icon={XCircle} size={16} color="var(--red)" />}</span>
          </div>
          {/* Question text */}
          <div style={{ fontWeight: 700, fontSize: "var(--t-sm)", marginBottom: 8, lineHeight: 1.5 }}>{q.q}</div>
          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 8 }}>
            {q.options.map((opt, oi) => {
              const isCorrect = oi === h.answer;
              const wasSelected = oi === h.selected;
              const showCorrect = isCorrect;
              const showWrong = !h.correct && wasSelected && !isCorrect;
              return (<div key={oi} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
                borderRadius: "var(--r-sm)",
                background: showCorrect ? "var(--navy2)" : showWrong ? "#7f1d1d22" : "var(--ink3)",
                border: `1.5px solid ${showCorrect ? "var(--emerald)" : showWrong ? "#ef4444" : "var(--border)"}`,
              }}>
                <span style={{
                  width: 20, height: 20, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--t-xs)", fontWeight: 900, flexShrink: 0,
                  background: showCorrect ? "var(--emerald)" : showWrong ? "#ef4444" : "var(--ink2)",
                  color: showCorrect || showWrong ? "#fff" : "var(--text3)"
                }}>
                  {["A", "B", "C", "D"][oi]}
                </span>
                <span style={{ fontSize: "var(--t-sm)", color: showCorrect ? "#86efac" : showWrong ? "#fca5a5" : "var(--text2)", flex: 1 }}>{opt}</span>
                {showCorrect && <span style={{ fontSize: 14, flexShrink: 0 }}><Ic icon={CheckCircle2} size={14} color="var(--emerald)" /></span>}
                {showWrong && <span style={{ fontSize: 14, flexShrink: 0 }}><Ic icon={XCircle} size={14} color="var(--red)" /></span>}
              </div>);
            })}
          </div>
          {/* What they chose vs correct */}
          {!h.correct && <div style={{ background: "var(--ink2)", borderRadius: "var(--r-sm)", padding: "8px 12px", marginBottom: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#fca5a5", fontSize: "var(--t-xs)", fontWeight: 700, flexShrink: 0 }}>{playerName} chose:</span>
              <span style={{ color: "#fca5a5", fontSize: "var(--t-xs)" }}>{h.selected === -1 ? "Time expired" : q.options[h.selected] || "—"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "#86efac", fontSize: "var(--t-xs)", fontWeight: 700, flexShrink: 0 }}>Correct answer:</span>
              <span style={{ color: "#86efac", fontSize: "var(--t-xs)" }}>{q.options[h.answer]}</span>
            </div>
          </div>}
          {/* Explanation */}
          {q.explanation && <div style={{ background: "var(--sky)11", border: "1px solid var(--sky)33", borderRadius: "var(--r-sm)", padding: "8px 12px", display: "flex", gap: 8 }}>
            <span style={{ flexShrink: 0, fontSize: 14 }}><Ic icon={Lightbulb} size={14} color="var(--sky)" /></span>
            <div style={{ color: "var(--sky)", fontSize: "var(--t-xs)", lineHeight: 1.6 }}>{q.explanation}</div>
          </div>}
        </div>);
      })}
    </div>);
  }

  return (<div className="screen" style={{ background: "radial-gradient(ellipse at 50% 0%,var(--primary)22,var(--bg) 55%)", padding: "var(--s-4) var(--s-4) calc(env(safe-area-inset-bottom,0px) + 100px)" }}>
    <div style={{ maxWidth: 620, margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--s-4)", paddingTop: "max(env(safe-area-inset-top,0px),40px)" }}>

      {/* Winner banner */}
      <div className="a-fadeUp" style={{ textAlign: "center", paddingTop: "var(--s-3)" }}>
        <div style={{ fontSize: "clamp(58px,12vw,88px)" }} className="a-float">{isDraw ? <Ic icon={Users} size={64} color="var(--amber)" /> : <Ic icon={Trophy} size={64} color="var(--amber)" />}</div>
        <h2 style={{ fontFamily: "var(--display)", fontSize: "var(--t-2xl)", letterSpacing: "-0.5px", background: "linear-gradient(135deg,var(--amber),var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "10px 0 4px" }}>
          {isDraw ? "It's a Draw!" : winName + " Wins!"}
        </h2>
        <p style={{ color: "var(--text3)", fontSize: "var(--t-sm)" }}>{cfg.subject} · {cfg.className} · {cfg.difficulty}</p>
      </div>

      {/* Score cards */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        {[{ n: p1, st: p1Stats, c: "var(--emerald)" }, ...(!isSolo ? [{ n: p2, st: p2Stats, c: "var(--amber)" }] : [])].map(({ n, st, c }) => (
          <div key={n} className="card-raised" style={{ border: `1.5px solid ${c}33`, flex: 1, maxWidth: 220, minWidth: 120, textAlign: "center" }}>
            <div style={{ color: c, fontWeight: 800, fontSize: "var(--t-sm)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginBottom: 4 }}>{n}</div>
            <div style={{ color: "var(--text)", fontSize: "var(--t-3xl)", fontWeight: 900, lineHeight: 1 }}>{st.correct}</div>
            <div style={{ color: "var(--text3)", fontSize: "var(--t-xs)", marginBottom: 2 }}>/ {st.played} answered ({st.pct}%)</div>
            <div style={{ height: 4, background: "var(--ink3)", borderRadius: 2, overflow: "hidden", marginTop: 6 }}>
              <div style={{ height: "100%", width: `${st.pct}%`, background: c, transition: "width 1.2s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8 }}>
              <span style={{ background: "var(--primary)15", border: "1px solid var(--emerald)33", borderRadius: 6, padding: "2px 8px", fontSize: "var(--t-xs)", color: "var(--emerald)", fontWeight: 700 }}>{st.correct} correct</span>
              <span style={{ background: "#7f1d1d22", border: "1px solid #ef444433", borderRadius: 6, padding: "2px 8px", fontSize: "var(--t-xs)", color: "#fca5a5", fontWeight: 700 }}>{st.wrong} missed</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "var(--ink3)", borderRadius: "var(--r-md)", overflow: "hidden", border: "1px solid var(--border)" }}>
        {[["summary", BarChart2, "Summary"], ["review", ClipboardList, "Review"], ["print", Printer, "Worksheet"]].map(([id, Ico, lb]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "11px 6px", background: tab === id ? "linear-gradient(135deg,var(--primary),var(--blue2))" : "transparent", border: "none", color: tab === id ? "var(--cream)" : "var(--text3)", fontWeight: 700, fontSize: "var(--t-sm)", cursor: "pointer", transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            <Ic icon={Ico} size={14} />{lb}</button>
        ))}
      </div>

      {/* SUMMARY TAB  */}
      {tab === "summary" && (<div className="a-fadeIn" style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
        {/* Per-player summary cards */}
        {[{ n: p1, st: p1Stats, c: "var(--emerald)" }, ...(!isSolo ? [{ n: p2, st: p2Stats, c: "var(--amber)" }] : [])].map(({ n, st, c }) => (
          <div key={n} className="card-raised" style={{ borderLeft: `4px solid ${c}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontWeight: 800, fontSize: "var(--t-md)", color: c }}>{n}</div>
              <div style={{ fontFamily: "var(--display)", fontSize: "var(--t-lg)", color: gradeColor(st.pct) }}>{grade(st.pct)}</div>
            </div>
            <div className="grid3">
              {[
                { ic: <Ic icon={CheckCheck} size={22} color="var(--emerald)" />, v: st.correct, l: "Correct", c: "var(--emerald)" },
                { ic: <Ic icon={XCircle} size={22} color="var(--red)" />, v: st.wrong, l: "Missed", c: "var(--red)" },
                { ic: <Ic icon={Target} size={22} color="var(--amber)" />, v: `${st.pct}%`, l: "Accuracy", c: "var(--amber)" },
              ].map(({ ic, v, l, c: cc }) => (
                <div key={l} className="card" style={{ textAlign: "center", padding: "10px 6px" }}>
                  <div style={{ fontSize: 18 }}>{ic}</div>
                  <div style={{ color: cc, fontWeight: 900, fontSize: "var(--t-xl)" }}>{v}</div>
                  <div style={{ color: "var(--text3)", fontSize: "var(--t-xs)" }}>{l}</div>
                </div>
              ))}
            </div>
            <p style={{ color: "var(--text3)", fontSize: "var(--t-xs)", marginTop: 8, lineHeight: 1.5 }}>{gradeMsg(st.pct)}</p>
          </div>
        ))}
      </div>)}

      {/* REVIEW TAB */}
      {tab === "review" && (<div className="a-fadeIn" style={{ display: "flex", flexDirection: "column", gap: "var(--s-3)" }}>
        {/* Player switcher — only in vs/ai mode */}
        {!isSolo && (<div style={{ display: "flex", background: "var(--ink3)", borderRadius: "var(--r-md)", overflow: "hidden", border: "1px solid var(--border)" }}>
          {[[0, p1, "var(--emerald)"], [1, p2, "var(--amber)"]].map(([pi, name, c]) => (
            <button key={pi} onClick={() => setReviewPlayer(pi)} style={{
              flex: 1, padding: "10px 8px", border: "none", cursor: "pointer", transition: "all .2s",
              background: reviewPlayer === pi ? `${c}22` : "transparent",
              borderBottom: reviewPlayer === pi ? `2px solid ${c}` : "2px solid transparent",
              color: reviewPlayer === pi ? c : "var(--text3)", fontWeight: 800, fontSize: "var(--t-sm)",
            }}>
              {reviewPlayer === pi ? "▶ " : ""}{name}
              <span style={{ marginLeft: 6, background: reviewPlayer === pi ? c + "33" : "var(--ink2)", borderRadius: 10, padding: "1px 7px", fontSize: "var(--t-xs)", color: reviewPlayer === pi ? c : "var(--text3)" }}>
                {pi === 0 ? p1History.filter(h => !h.correct).length : p2History.filter(h => !h.correct).length} missed
              </span>
            </button>
          ))}
        </div>)}
        {/* Review list for selected player */}
        <div style={{ maxHeight: 480, overflowY: "auto" }}>
          <ReviewList
            playerHist={reviewPlayer === 0 ? p1History : p2History}
            playerName={reviewPlayer === 0 ? p1 : p2}
            color={reviewPlayer === 0 ? "var(--emerald)" : "var(--amber)"}
          />
        </div>
      </div>)}

      {/*  WORKSHEET TAB */}
      {tab === "print" && (<div className="a-fadeIn card">
        <p style={{ color: "var(--text2)", fontSize: "var(--t-sm)", marginBottom: 14, lineHeight: 1.6 }}>Generate a printable worksheet with all questions, answer spaces, and a teacher's answer key.</p>
        <button className="btn btn-green" onClick={printWS}><Ic icon={Printer} size={16} style={{ marginRight: 6 }} />Print / Save as PDF</button>
      </div>)}

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={onReplay}><Ic icon={RotateCcw} size={16} style={{ marginRight: 6 }} />Play Again</button>
        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onHome}><Ic icon={Home} size={16} style={{ marginRight: 6 }} />Home</button>
      </div>
    </div>
  </div>);
}

// ROOT APP 
export default function App() {
  const [cfg, setCfg] = useState(() => { const s = ls.get("etow_cfg") || {}; Sound.setMuted(s.muted || false); return { muted: false, ...s }; });
  const [screen, setScreen] = useState("splash");
  const [gameCfg, setGameCfg] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const [loadMsg, setLoadMsg] = useState("");
  const [loadErr, setLoadErr] = useState("");
  const [isOffline, setIsOffline] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [ropePos, setRopePos] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [scores, setScores] = useState([0, 0]);
  const [curPlayer, setCurPlayer] = useState(0);
  const [aiThink, setAiThink] = useState(false);
  const [streak, setStreak] = useState([0, 0]);
  const [winner, setWinner] = useState(null);
  const [history, setHistory] = useState([]);
  const [timerKey, setTimerKey] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [modal, setModal] = useState(null);
  const { online, syncing, flush } = useSyncStatus();

  useEffect(() => { window.__newGame = () => setScreen("splash"); }, []);

  async function startGame(gc) {
    setGameCfg(gc); setLoadErr(""); setLoading(true); setLoadPct(0); setIsOffline(false);
    setLoadMsg("🤖 Connecting to AI engine…");
    let p = 0; const pi = setInterval(() => {
      // Slow down near 85% to allow for retry waits without freezing bar
      p = p < 30 ? p + 6 : p < 65 ? p + 2.2 : p < 80 ? p + .9 : p < 87 ? p + .15 : p;
      setLoadPct(Math.round(p));
    }, 270);
    try {
      let qs;
      const banked = bankGetBySubject(gc.className, gc.subject);
      const saved = dbGetBySubject(gc.className, gc.subject);
      // Use stored questions if we have enough — no internet needed
      const allStored = [...banked, ...saved.filter(q => !banked.some(b => b.q === q.q))];
      if (allStored.length >= gc.questionCount) {
        clearInterval(pi); setLoadPct(96); setLoadMsg("📚 Ready!"); setIsOffline(true);
        qs = [...allStored].sort(() => Math.random() - .5).slice(0, gc.questionCount);
      } else if (allStored.length >= 4 && allStored.length < gc.questionCount) {
        // Have some but not enough — try AI to top up
        clearInterval(pi);
        const need = gc.questionCount - allStored.length;
        try {
          setLoadMsg(`🤖 Fetching ${need} more questions…`);
          const extra = await aiGenerate({ levelLabel: gc.level?.label || "", className: gc.className, subject: gc.subject, difficulty: gc.difficulty, count: need, signal: ctrl.signal, levelKey: gc.levelKey });
          const newOnes = extra.filter(eq => !allStored.some(s => s.q === eq.q));
          qs = [...allStored, ...newOnes].sort(() => Math.random() - .5).slice(0, gc.questionCount);
        } catch {
          qs = [...allStored].sort(() => Math.random() - .5).slice(0, gc.questionCount);
        }
        setIsOffline(false);
      } else {
        setLoadMsg(`📚 Generating ${gc.questionCount} ${gc.subject} questions for ${gc.className}…`);
        const ctrl = new AbortController(); const tout = setTimeout(() => ctrl.abort(), 28000);
        try {
          qs = await aiGenerate({ levelLabel: gc.level?.label || "", className: gc.className, subject: gc.subject, difficulty: gc.difficulty, count: gc.questionCount, signal: ctrl.signal, levelKey: gc.levelKey });
          clearTimeout(tout); clearInterval(pi); setLoadPct(95); setLoadMsg(`✅ ${qs.length} questions ready!`);
          dbSave(qs.map(q => ({ ...q, subject: gc.subject, className: gc.className })));
        } catch (aiErr) {
          clearTimeout(tout); clearInterval(pi);
          const isRL = aiErr.isRateLimit || aiErr.message?.toLowerCase().includes("rate");
          const isAbort = aiErr.name === "AbortError";
          if (!isAbort) {
            setLoadPct(90);
            setLoadMsg(isRL
              ? `API busy — loading offline questions for ${gc.subject}…`
              : ` Loading offline questions for ${gc.subject}…`);
          }
          setIsOffline(true);
          qs = getFallback(gc.className, gc.subject, gc.questionCount);
          if (!qs?.length) {
            // Last resort: check DB for any saved questions for this subject
            const anyDB = dbGet().filter(q => q.subject === gc.subject).slice(0, gc.questionCount);
            if (anyDB.length >= 3) { qs = anyDB; }
            else throw new Error(` No questions available for "${gc.subject}" (${gc.className}).\n\n${isRL ? "The AI is temporarily busy (rate limit).\n" : ""}Please:\n• Try again in a moment\n• Check your API key in Settings ⚙️\n• Use Teacher Portal 📚 to add questions for this subject`);
          }
        }
      }
      await new Promise(r => setTimeout(r, 350)); setLoadPct(100);
      setQuestions(qs); setQIndex(0); setRopePos(0); setSelected(null); setRevealed(false);
      setScores([0, 0]); setCurPlayer(0); setStreak([0, 0]); setWinner(null); setHistory([]); setTimerKey(0); setShowConfetti(false);
      setScreen("game");
    } catch (e) { clearInterval(pi); setLoadErr(e.message || "Failed to load questions. Please try again."); }
    setLoading(false);
  }

  // ANSWER HANDLER 
  // Called by human click OR by AI auto-play
  function handleAnswer(idx) {
    if (revealed || aiThink) return;
    const q = questions[qIndex];
    const correct = idx === q.answer;
    setSelected(idx);
    setRevealed(true);
    correct ? Sound.correct() : Sound.wrong();
    Sound.pull();
    // Rope: correct pulls toward answering player, wrong pulls away
    const pull = correct ? 20 : -8;
    const newRope = Math.max(-100, Math.min(100, ropePos + (curPlayer === 0 ? pull : -pull)));
    setRopePos(newRope);
    const ns = [...scores]; if (correct) ns[curPlayer]++; setScores(ns);
    const nst = [...streak]; if (correct) nst[curPlayer]++; else nst[curPlayer] = 0; setStreak(nst);
    setHistory(h => [...h, { selected: idx, correct, answer: q.answer, player: curPlayer, qIndex: qIndex }]);
    // Rope is visual only — game always plays all questions
    // (removing early rope-win prevents auto-submit after 5 correct answers)
  }

  // TIMER EXPIRED 
  function handleTimerExpire() {
    if (revealed) return;
    Sound.wrong();
    setSelected(-1);
    setRevealed(true);
    const newRope = Math.max(-100, Math.min(100, ropePos + (curPlayer === 0 ? -8 : 8)));
    setRopePos(newRope);
    setHistory(h => [...h, { selected: -1, correct: false, answer: questions[qIndex].answer, player: curPlayer, qIndex: qIndex }]);
  }

  //  NEXT QUESTION 
  // In ALL multi-player modes: after each answer, switch who plays next
  function nextQuestion() {
    if (qIndex >= questions.length - 1) {
      finishGame(ropePos === 0 ? -1 : ropePos > 0 ? 0 : 1, scores);
      return;
    }
    // Clear answer state first
    setRevealed(false);
    setSelected(null);
    setTimerKey(k => k + 1);
    setQIndex(q => q + 1);
    // Switch turns in vs and ai mode
    if (gameCfg?.mode === "vs" || gameCfg?.mode === "ai") {
      setCurPlayer(p => p === 0 ? 1 : 0);
    }
  }

  // FINISH GAME 
  function finishGame(win, sc) {
    setWinner(win);
    if (win >= 0) {
      Sound.victory();
      setShowConfetti(true);
      lbSave({
        name: win === 0 ? gameCfg.player1 : gameCfg.player2,
        score: sc[win], total: questions.length,
        pct: Math.round((sc[win] / questions.length) * 100),
        subject: gameCfg.subject, className: gameCfg.className,
        difficulty: gameCfg.difficulty
      });
    }
    setScreen("result");
  }

  function reset() { setScreen("splash"); setLoading(false); setLoadErr(""); setQuestions([]); setGameCfg(null); setShowConfetti(false); }

  // AI AUTO-PLAY 
  // Fires when: mode is ai, it's AI's turn (curPlayer===1), and not already revealed
  // Ref guard: prevents AI from firing twice on the same question
  const aiPlayedRef = useRef(false);
  useEffect(() => { aiPlayedRef.current = false; }, [qIndex]);

  useEffect(() => {
    if (gameCfg?.mode !== "ai") return;
    if (curPlayer !== 1) return;        // only fire on AI's turn
    if (revealed) return;             // don't fire after answer revealed
    if (!questions[qIndex]) return;
    if (aiPlayedRef.current) return;  // already played this question
    aiPlayedRef.current = true;      // lock immediately to prevent double-fire
    setAiThink(true);
    const delay = 900 + Math.random() * 1100;
    const t = setTimeout(() => {
      // Re-check still AI turn (state may have changed during delay)
      const acc = GAME_CONFIG.AI_ACCURACY[gameCfg.difficulty] || GAME_CONFIG.AI_ACCURACY.Medium;
      const aiCorrect = Math.random() < acc;
      let ans;
      if (aiCorrect) {
        ans = questions[qIndex].answer;
      } else {
        const wrong = [0, 1, 2, 3].filter(i => i !== questions[qIndex].answer);
        ans = wrong[Math.floor(Math.random() * wrong.length)];
      }
      handleAnswer(ans);
      setAiThink(false);
    }, delay);
    return () => { clearTimeout(t); setAiThink(false); };
  }, [curPlayer, qIndex, gameCfg?.mode, gameCfg?.difficulty]);

  return (<>
    <style>{GLOBAL_CSS}</style>
    {showConfetti && <Confetti />}

    <Toolbar visible={screen !== "loading"} muted={cfg.muted}
      setMuted={v => { const nc = { ...cfg, muted: v }; setCfg(nc); ls.set("etow_cfg", nc); Sound.setMuted(v); }}
      onSettings={() => setModal("settings")} onTeacher={() => setModal("teacher")} onLeaderboard={() => setModal("lb")} />
    {modal === "settings" && <SettingsModal cfg={cfg} setCfg={v => { setCfg(v); ls.set("etow_cfg", v); }} onClose={() => setModal(null)} />}
    {modal === "teacher" && <TeacherModal cfg={cfg} onClose={() => setModal(null)} onSaved={() => setModal(null)} />}
    {modal === "lb" && <LeaderboardModal onClose={() => setModal(null)} />}
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
      {screen === "splash" && <SplashScreen onPlay={() => setScreen("setup")} onSettings={() => setModal("settings")} />}
      {screen === "setup" && !loading && <SetupScreen onStart={startGame} cfg={cfg} setCfg={setCfg} />}
      {loading && <LoadingScreen msg={loadMsg} pct={loadPct} error={loadErr} onBack={() => { setLoading(false); setScreen("setup"); }} />}
      {screen === "game" && questions.length > 0 && <GameScreen cfg={gameCfg} questions={questions} qIndex={qIndex} ropePos={ropePos} selected={selected} revealed={revealed} scores={scores} streak={streak} currentPlayer={curPlayer} aiThinking={aiThink} isOffline={isOffline} timerKey={timerKey} onAnswer={handleAnswer} onNext={nextQuestion} onTimerExpire={handleTimerExpire} onQuit={reset} />}
      {screen === "result" && <ResultScreen winner={winner} cfg={gameCfg} scores={scores} questions={questions} history={history} onReplay={() => startGame(gameCfg)} onHome={reset} />}
    </div>
  </>);
}
