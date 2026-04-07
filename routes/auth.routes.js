const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const authController = require("../controllers/auth.controller");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { authSchemas } = require("../validators/schemas");

// Limit login attempts: 3 failed attempts per 15 minutes per IP+username.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  requestWasSuccessful: (req, res) => res.statusCode < 400,
  keyGenerator: (req) => {
    const u = req && req.body && req.body.username ? String(req.body.username).toLowerCase() : "";
    return `${req.ip}:${u}`;
  },
  message: {
    success: false,
    message: "Terlalu banyak percobaan login. Silahkan tunggu 15 menit.",
    error: "rate_limited"
  }
});

router.post("/login", loginLimiter, validate(authSchemas.login), authController.login);
router.get("/me", auth.allowUnapproved, authController.me);

// 2FA (Google Authenticator / TOTP)
router.post("/2fa/setup", auth, authController.twofaSetup);
router.post("/2fa/verify", auth.allowPending, authController.twofaVerify);

module.exports = router;
