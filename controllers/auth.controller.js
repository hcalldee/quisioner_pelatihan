const crypto = require("crypto");
const User = require("../models/user.model");
const { createToken } = require("../utils/jwt");
const { generateSecretBase32, verifyTotp, buildOtpAuthUrl } = require("../utils/totp");

function verifyPassword(password, stored) {
  if (!stored || typeof stored !== "string" || !stored.includes(":")) return false;
  const [salt, hashHex] = stored.split(":");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hashHex, "hex");
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function requireJwtSecret(res) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ success: false, message: "JWT_SECRET belum diset" });
    return null;
  }
  return secret;
}

function issueToken({ user, secret, ttlSeconds, twofa }) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: user.id,
    username: user.username,
    email: user.email,
    approved: user.approved ?? 1,
    twofa_enabled: user.twofa_enabled ?? 0,
    twofa,
    iat: now,
    exp: now + ttlSeconds
  };
  return createToken(payload, secret);
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "username dan password wajib diisi"
      });
    }

    const user = await User.findByUsername(username);
    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({
        success: false,
        message: "username atau password salah"
      });
    }

    const secret = requireJwtSecret(res);
    if (!secret) return;

    // Approval gate: user must be approved by admin (id=1) before any 2FA flow.
    if (String(user.approved) === "0" && String(user.id) !== "1") {
      const ttlSeconds = Number(process.env.JWT_TTL_SECONDS || 900);
      const token = issueToken({ user, secret, ttlSeconds, twofa: "ok" });

      return res.status(200).json({
        success: true,
        data: {
          requires_approval: true,
          requires_2fa: false,
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        }
      });
    }

    // Jika 2FA sudah aktif, jangan issue full token dulu.
    if (String(user.twofa_enabled) === "1") {
      const ttl2fa = Number(process.env.JWT_2FA_TTL_SECONDS || 300);
      const temp_token = issueToken({ user, secret, ttlSeconds: ttl2fa, twofa: "pending" });

      return res.status(200).json({
        success: true,
        data: {
          requires_2fa: true,
          temp_token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        }
      });
    }

    const ttlSeconds = Number(process.env.JWT_TTL_SECONDS || 900);
    const token = issueToken({ user, secret, ttlSeconds, twofa: "ok" });

    return res.status(200).json({
      success: true,
      data: {
        requires_2fa: false,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Setup secret untuk Google Authenticator (scan QR via otpauth_url)
exports.twofaSetup = async (req, res) => {
  try {
    const secretJwt = requireJwtSecret(res);
    if (!secretJwt) return;

    const userId = req.user && req.user.sub;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    if (String(user.approved) === "0" && String(user.id) !== "1") {
      return res.status(403).json({ success: false, message: "Akun belum diapprove" });
    }

    const issuer = process.env.OTP_ISSUER || "Quisioner Pelatihan";
    const secretBase32 = generateSecretBase32(20);

    // Simpan secret, belum enable sampai verify.
    await User.setTwofaSecret(user.id, secretBase32);

    const otpauth_url = buildOtpAuthUrl({
      issuer,
      username: user.username,
      secretBase32
    });

    // Simple option without extra npm deps: return a QR render URL too.
    // Client can open this URL or embed as <img src="...">.
    const qr_url = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
      otpauth_url
    )}`;

    return res.status(200).json({
      success: true,
      data: {
        secret: secretBase32,
        otpauth_url,
        qr_url
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Verify kode 6 digit dari Google Authenticator
exports.twofaVerify = async (req, res) => {
  try {
    const secretJwt = requireJwtSecret(res);
    if (!secretJwt) return;

    const userId = req.user && req.user.sub;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { code } = req.body || {};
    if (!code) {
      return res.status(400).json({ success: false, message: "code wajib diisi" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    if (String(user.approved) === "0" && String(user.id) !== "1") {
      return res.status(403).json({ success: false, message: "Akun belum diapprove" });
    }

    if (!user.twofa_secret) {
      return res.status(400).json({
        success: false,
        message: "2FA belum disetup. Panggil /api/auth/2fa/setup dulu"
      });
    }

    const ok = verifyTotp(user.twofa_secret, code, { window: 1 });
    if (!ok) {
      return res.status(400).json({
        success: false,
        message: "Kode 2FA tidak valid"
      });
    }

    // Enable 2FA setelah kode valid
    await User.enableTwofa(user.id);

    const ttlSeconds = Number(process.env.JWT_TTL_SECONDS || 900);
    // Re-fetch so token claims reflect current DB state (twofa_enabled=1).
    const updatedUser = await User.findById(user.id);
    const token = issueToken({ user: updatedUser || { ...user, twofa_enabled: 1 }, secret: secretJwt, ttlSeconds, twofa: "ok" });

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.me = async (req, res) => {
  try {
    const userId = req.user && req.user.sub;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          sub: user.id,
          username: user.username,
          email: user.email,
          approved: user.approved ?? 1,
          twofa_enabled: user.twofa_enabled ?? 0,
          twofa: req.user.twofa
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

