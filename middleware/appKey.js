module.exports = function appKey(req, res, next) {
  const expected = process.env.APP_USER_KEY;
  if (!expected) {
    return res.status(500).json({
      success: false,
      message: "APP_USER_KEY belum diset"
    });
  }

  const key = req.headers["x-app-key"] || req.headers["X-App-Key"];
  if (key && String(key) === String(expected)) return next();

  return res.status(401).json({
    success: false,
    message: "Unauthorized",
    error: "invalid_app_key"
  });
};
