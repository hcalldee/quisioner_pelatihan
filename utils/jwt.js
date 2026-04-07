const crypto = require("crypto");

function base64urlEncode(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64urlDecodeToBuffer(input) {
  const b64 = String(input).replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  return Buffer.from(b64 + pad, "base64");
}

function jsonDecode(part) {
  return JSON.parse(base64urlDecodeToBuffer(part).toString("utf8"));
}

function signHs256(data, secret) {
  return crypto.createHmac("sha256", secret).update(data).digest();
}

function createToken(payload, secret) {
  const header = { alg: "HS256", typ: "JWT" };
  const h = base64urlEncode(JSON.stringify(header));
  const p = base64urlEncode(JSON.stringify(payload));
  const data = `${h}.${p}`;
  const sig = base64urlEncode(signHs256(data, secret));
  return `${data}.${sig}`;
}

function verifyToken(token, secret) {
  const parts = String(token).split(".");
  if (parts.length !== 3) return { ok: false, error: "invalid_token_format" };

  const [h, p, s] = parts;
  let header;
  let payload;
  try {
    header = jsonDecode(h);
    payload = jsonDecode(p);
  } catch {
    return { ok: false, error: "invalid_token_json" };
  }

  if (!header || header.alg !== "HS256") {
    return { ok: false, error: "unsupported_alg" };
  }

  const data = `${h}.${p}`;
  const expected = base64urlEncode(signHs256(data, secret));

  // Constant-time compare
  const a = Buffer.from(expected);
  const b = Buffer.from(String(s));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, error: "invalid_signature" };
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload && payload.exp && now >= payload.exp) {
    return { ok: false, error: "token_expired" };
  }

  return { ok: true, payload };
}

module.exports = {
  createToken,
  verifyToken
};

