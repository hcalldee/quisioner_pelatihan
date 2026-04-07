const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const validate = require("../middleware/validate");
const { userSchemas } = require("../validators/user.schemas");

// CREATE USER
router.post("/", auth, adminOnly, validate(userSchemas.create), userController.create);

// READ
router.get("/", auth, adminOnly, userController.findAll);
router.get("/:id", auth, adminOnly, userController.findById);

// UPDATE
router.put("/:id", auth, adminOnly, validate(userSchemas.update), userController.update);
router.put("/:id/approve", auth, adminOnly, validate(userSchemas.approve), userController.approve);
router.put("/:id/reset-2fa", auth, adminOnly, userController.resetTwofa);

// DELETE
router.delete("/:id", auth, adminOnly, userController.remove);

module.exports = router;
