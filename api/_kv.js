// Thin wrapper around the Vercel KV (Upstash Redis) REST API — no SDK
// dependency, just fetch. Requires KV_REST_API_URL + KV_REST_API_TOKEN,
// which Vercel injects automatically once the KV store is linked to the
// project (Storage tab → Upstash Redis integration).

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

async function kv(...command) {
  if (!KV_URL || !KV_TOKEN) {
    throw new Error("KV not configured (missing KV_REST_API_URL/TOKEN)");
  }
  const path = command.map(encodeURIComponent).join("/");
  const res = await fetch(`${KV_URL}/${path}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  if (!res.ok) {
    throw new Error(`KV command failed (${res.status}): ${command[0]}`);
  }
  const data = await res.json();
  return data.result;
}

module.exports = { kv };
