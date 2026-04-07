module.exports = function validate(schema, property = "body") {
  return function validateMiddleware(req, res, next) {
    const target = req[property] || {};

    const { error, value } = schema.validate(target, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        error: error.details.map((d) => d.message)
      });
    }

    req[property] = value;
    next();
  };
};
