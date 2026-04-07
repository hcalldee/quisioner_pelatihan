const Joi = require("joi");

function noHtml(value, helpers) {
  if (typeof value !== "string") return value;

  // Very simple guard: blocks HTML/script tags.
  // This is not a sanitizer, it's an input validator.
  if (/<\s*\/?\s*\w+[^>]*>/i.test(value)) {
    return helpers.error("string.html");
  }

  return value;
}

function noHtmlAllowBr(value, helpers) {
  if (typeof value !== "string") return value;

  // Allow <br> / <br/> tags only, reject any other tag.
  const cleaned = value.replace(/<\s*br\s*\/?\s*>/gi, "");
  if (/<\s*\/?\s*\w+[^>]*>/i.test(cleaned)) {
    return helpers.error("string.html");
  }

  return value;
}

const safeString = () =>
  Joi.string().custom(noHtml, "no HTML").messages({
    "string.html": "Input mengandung tag HTML"
  });

const safeTextWithBr = () =>
  Joi.string().custom(noHtmlAllowBr, "no HTML except br").messages({
    "string.html": "Input mengandung tag HTML"
  });

const authSchemas = {
  login: Joi.object({
    username: safeString()
      .trim()
      .min(3)
      .max(64)
      .pattern(/^[a-zA-Z0-9_.@-]+$/)
      .required()
      .messages({
        "string.pattern.base": "username hanya boleh huruf/angka dan karakter . _ @ -"
      }),
    password: safeString().min(8).max(128).required()
  })
};

module.exports = { authSchemas, safeString, safeTextWithBr };
