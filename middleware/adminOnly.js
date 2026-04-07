module.exports = function adminOnly(req, res, next) {
  // Admin is user with id=1
  if (req.user && String(req.user.sub) === "1") return next();

  return res.status(403).json({
    success: false,
    message: "Forbidden",
    error: "admin_only"
  });
};
