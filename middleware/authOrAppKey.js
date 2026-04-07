const auth = require("./auth");
const appKey = require("./appKey");

// Allows either Authorization: Bearer <jwt> OR x-app-key: <key>
module.exports = function authOrAppKey(req, res, next) {
  const hasBearer = !!(req.headers.authorization || req.headers.Authorization);
  if (hasBearer) return auth(req, res, next);
  return appKey(req, res, next);
};
