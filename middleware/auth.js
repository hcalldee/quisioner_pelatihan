const { createToken, verifyToken } = require("../utils/jwt");

function getBearerToken(req) {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth) return null;
  const parts = String(auth).split(" ");
  if (parts.length === 2 && parts[0].toLowerCase() === "bearer") return parts[1];
  return null;
}

function buildAuthMiddleware({ allowPending2fa = false, allowUnapproved = false, refresh = true } = {}) {
  return function authMiddleware(req, res, next) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET belum diset"
      });
    }

    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const result = verifyToken(token, secret);
    if (!result.ok) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        error: result.error
      });
    }

    // Block tokens that are still in 2FA pending state.
    if (!allowPending2fa && result.payload && result.payload.twofa === "pending") {
      return res.status(403).json({
        success: false,
        message: "2FA diperlukan",
        error: "twofa_required"
      });
    }

    // Block users that are not approved yet (except on allowUnapproved routes).
    if (!allowUnapproved && result.payload && String(result.payload.approved) === "0" && String(result.payload.sub) !== "1") {
      return res.status(403).json({
        success: false,
        message: "Akun belum diapprove",
        error: "approval_required"
      });
    }

    req.user = result.payload;

    if (refresh) {
      // Sliding expiration: always refresh the token on successful auth.
      const ttlSeconds = Number(process.env.JWT_TTL_SECONDS || 900);
      const now = Math.floor(Date.now() / 1000);
      const refreshedPayload = {
        ...result.payload,
        iat: now,
        exp: now + ttlSeconds
      };
      const refreshedToken = createToken(refreshedPayload, secret);

      // Let browser JS read the header (CORS).
      res.setHeader("Access-Control-Expose-Headers", "x-access-token");
      res.setHeader("x-access-token", refreshedToken);
    }

    next();
  };
}

const auth = buildAuthMiddleware({ allowPending2fa: false, allowUnapproved: false, refresh: true });

// Used only for /api/auth/2fa/verify (still pending 2FA).
auth.allowPending = buildAuthMiddleware({ allowPending2fa: true, allowUnapproved: false, refresh: false });

// Used for /api/auth/me so unapproved users can still see their status.
auth.allowUnapproved = buildAuthMiddleware({ allowPending2fa: false, allowUnapproved: true, refresh: true });

module.exports = auth;

