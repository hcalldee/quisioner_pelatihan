const express = require("express");
const router = express.Router();
const pertanyaanController = require("../controllers/pertanyaan.controller");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { pertanyaanSchemas } = require("../validators/api.schemas");

// Protect all pertanyaan endpoints
router.use(auth);

// CREATE
router.post("/", validate(pertanyaanSchemas.create), pertanyaanController.create);

// READ ALL
router.get("/", pertanyaanController.findAll);

// SEARCH
router.post("/search", validate(pertanyaanSchemas.search), pertanyaanController.search);

// READ BY ID
router.get("/:id", pertanyaanController.findById);

// UPDATE
router.put("/:id", validate(pertanyaanSchemas.update), pertanyaanController.update);

// DELETE
router.delete("/:id", pertanyaanController.remove);

module.exports = router;
