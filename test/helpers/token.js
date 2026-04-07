const { createToken } = require("../../utils/jwt");

function getTestToken(payloadOverrides = {}) {
  // Default secret untuk test. Di runtime normal pakai .env JWT_SECRET.
  if (!process.env.JWT_SECRET) process.env.JWT_SECRET = "test-jwt-secret";

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: "test",
    username: "test",
    approved: 1,
    twofa: "ok",
    iat: now,
    exp: now + 60 * 60, // 1 jam
    ...payloadOverrides
  };

  return createToken(payload, process.env.JWT_SECRET);
}

module.exports = getTestToken;
