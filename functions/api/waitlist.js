const ALLOWED_ORIGINS = ["https://tradesummit.online", "https://www.tradesummit.online"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost(context) {
  const { request, env } = context;
  const origin = request.headers.get("Origin") || "";

  let body;
  try {
    body = await request.json();
  } catch (_) {
    return cors(
      new Response(JSON.stringify({ error: "invalid_json" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
      origin
    );
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email)) {
    return cors(
      new Response(JSON.stringify({ error: "invalid_email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
      origin
    );
  }

  const source =
    typeof body.source === "string" && body.source.length <= 64 ? body.source : "web";
  const referrer =
    typeof body.referrer === "string" && body.referrer.length <= 512 ? body.referrer : null;

  try {
    await env.DB.prepare(
      "INSERT INTO waitlist_leads (email, source, referrer) VALUES (?1, ?2, ?3)" +
        " ON CONFLICT(email) DO NOTHING"
    )
      .bind(email, source, referrer)
      .run();

    return cors(
      new Response(JSON.stringify({ ok: true }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }),
      origin
    );
  } catch (err) {
    console.error("waitlist insert failed", err);
    return cors(
      new Response(JSON.stringify({ error: "internal" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
      origin
    );
  }
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get("Origin") || "";
  const res = new Response(null, { status: 204 });
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  res.headers.set("Access-Control-Max-Age", "86400");
  return cors(res, origin);
}

export async function onRequest(context) {
  const { request } = context;
  const origin = request.headers.get("Origin") || "";
  return cors(
    new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    }),
    origin
  );
}

function cors(res, origin) {
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}