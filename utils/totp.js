const crypto = require("crypto");

// RFC 4648 Base32 alphabet
const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Encode(buf) {
  let bits = 0;
  let value = 0;
  let out = "";

  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    out += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return out;
}

function base32Decode(str) {
  const clean = String(str)
    .toUpperCase()
    .replace(/=+$/g, "")
    .replace(/[^A-Z2-7]/g, "");

  let bits = 0;
  let value = 0;
  const bytes = [];

  for (const ch of clean) {
    const idx = BASE32_ALPHABET.indexOf(ch);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

function generateSecretBase32(byteLen = 20) {
  const buf = crypto.randomBytes(byteLen);
  return base32Encode(buf);
}

function hotp(secretBase32, counter, digits = 6) {
  const key = base32Decode(secretBase32);

  const ctr = Buffer.alloc(8);
  const hi = Math.floor(counter / 0x100000000);
  const lo = counter >>> 0;
  ctr.writeUInt32BE(hi, 0);
  ctr.writeUInt32BE(lo, 4);

  const hmac = crypto.createHmac("sha1", key).update(ctr).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binCode =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const mod = 10 ** digits;
  return (binCode % mod).toString().padStart(digits, "0");
}

function totp(secretBase32, { time = Date.now(), step = 30, digits = 6 } = {}) {
  const counter = Math.floor(Math.floor(time / 1000) / step);
  return hotp(secretBase32, counter, digits);
}

function verifyTotp(
  secretBase32,
  code,
  { window = 1, time = Date.now(), step = 30, digits = 6 } = {}
) {
  const input = String(code || "").trim();
  if (!/^\d{6}$/.test(input)) return false;

  const counterNow = Math.floor(Math.floor(time / 1000) / step);
  for (let w = -window; w <= window; w++) {
    if (hotp(secretBase32, counterNow + w, digits) === input) return true;
  }
  return false;
}

function buildOtpAuthUrl({ issuer, username, secretBase32 }) {
  const safeIssuer = String(issuer || "Quisioner").trim() || "Quisioner";
  const safeUser = String(username || "user").trim() || "user";
  const label = encodeURIComponent(`${safeIssuer}:${safeUser}`);
  const qs = new URLSearchParams({
    secret: secretBase32,
    issuer: safeIssuer,
    algorithm: "SHA1",
    digits: "6",
    period: "30"
  });
  return `otpauth://totp/${label}?${qs.toString()}`;
}

module.exports = {
  generateSecretBase32,
  totp,
  verifyTotp,
  buildOtpAuthUrl
};
