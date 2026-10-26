import { getStore } from "@netlify/blobs";
export default async (req) => {
  const store = getStore("p5am");
  if (req.method === "GET") {
    const d = await store.get("state", { type: "json" });
    return Response.json(d || null, { headers: { "cache-control": "no-store" } });
  }
  if (req.method === "POST") {
    const pw = Netlify.env.get("ADMIN_PASSWORD");
    if (!pw || req.headers.get("x-admin") !== pw) return new Response("forbidden", { status: 403 });
    const b = await req.json().catch(() => null);
    if (!b || !Array.isArray(b.members) || !Array.isArray(b.events)) return new Response("bad request", { status: 400 });
    await store.setJSON("state", b);
    return Response.json({ ok: true });
  }
  return new Response("method not allowed", { status: 405 });
};
export const config = { path: "/api/state" };
