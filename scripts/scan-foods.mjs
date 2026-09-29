// Runs every food in content/food-list.mjs through the real Clear Food scan
// (Supabase edge function `analyze`, text path) and stores the results in
// content/scans.json. Foods already in that file are skipped — delete an
// entry to rescan it. Numbers come from the English run; the German run only
// supplies the German pros/cons, so both languages show the same scores.
import { readFile, writeFile } from 'node:fs/promises';
import { FOODS } from '../content/food-list.mjs';

const FN_URL = 'https://zuvthbyvsjyhklpfoibq.supabase.co/functions/v1/analyze';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1dnRoYnl2c2p5aGtscGZvaWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNjU4MTMsImV4cCI6MjA5Njc0MTgxM30._wyh9tBM162dKznibckeq1R6HjbglCM2op62sxLG5h0'; // public anon key, same as in the app
const GOALS = ['clear_skin', 'body_fat', 'build_muscle', 'less_bloat'].map((key) => ({ key, weight: 1 }));
const FILE = new URL('../content/scans.json', import.meta.url);

// Gemini/edge hiccups (5xx) are transient — retry a few times before giving up.
async function scan(text, lang, attempt = 1) {
  try { return await scanOnce(text, lang); }
  catch (e) {
    if (attempt >= 4) throw e;
    await new Promise((r) => setTimeout(r, 3000 * attempt));
    return scan(text, lang, attempt + 1);
  }
}

async function scanOnce(text, lang) {
  const res = await fetch(FN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}`, 'x-device-id': `website-foods-${lang}` },
    body: JSON.stringify({ textDescription: text, goals: GOALS, lang }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 120)}`);
  return res.json();
}

// Same rule as lib/analyze.js in the app: the ring shows the mean of the goal bars.
function overall(goals) {
  const s = goals.map((g) => Number(g.score)).filter(Number.isFinite);
  return Math.round(s.reduce((a, b) => a + b, 0) / s.length);
}

async function both(text) {
  const [en, de] = await Promise.all([scan(text, 'en'), scan(text, 'de')]);
  return {
    input: text,
    score: overall(en.goals),
    goals: Object.fromEntries(en.goals.map((g) => [g.key, g.score])),
    macros: en.macros, servingGrams: en.servingGrams, servingUnit: en.servingUnit,
    why: { en: en.why, de: de.why }, cautions: { en: en.cautions, de: de.cautions },
  };
}

const store = JSON.parse(await readFile(FILE, 'utf8').catch(() => '{}'));
for (const f of FOODS) {
  if (store[f.slug]) continue;
  process.stdout.write(`${f.slug} … `);
  const main = await both(f.scan);
  const swap = f.swap ? await both(f.swap.scan) : null;
  store[f.slug] = { ...main, scannedAt: new Date().toISOString().slice(0, 10), swap };
  console.log(main.score, swap ? `→ swap ${swap.score}` : '');
  await writeFile(FILE, JSON.stringify(store, null, 2) + '\n');
}
