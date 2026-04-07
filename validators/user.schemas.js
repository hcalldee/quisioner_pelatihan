const Joi = require("joi");
const { safeString } = require("./schemas");

const userSchemas = {
  create: Joi.object({
    username: safeString()
      .trim()
      .min(3)
      .max(64)
      .pattern(/^[a-zA-Z0-9_.@-]+$/)
      .required(),
    password: safeString().min(8).max(128).required(),
    email: Joi.alternatives()
      .try(Joi.string().email().max(255), Joi.allow(null), Joi.allow(""))
      .default(null)
  }),

  update: Joi.object({
    username: safeString()
      .trim()
      .min(3)
      .max(64)
      .pattern(/^[a-zA-Z0-9_.@-]+$/),
    password: safeString().min(8).max(128),
    email: Joi.alternatives().try(Joi.string().email().max(255), Joi.allow(null), Joi.allow(""))
  }).min(1),

  approve: Joi.object({
    approved: Joi.number().valid(0, 1).default(1)
  }),
};

module.exports = { userSchemas };
