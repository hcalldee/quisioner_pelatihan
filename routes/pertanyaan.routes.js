const express = require("express");
const router = express.Router();
const pertanyaanController = require("../controllers/pertanyaan.controller");

// CREATE
router.post("/", pertanyaanController.create);

// READ ALL
router.get("/", pertanyaanController.findAll);

// SEARCH
router.post("/search", pertanyaanController.search);

// READ BY ID
router.get("/:id", pertanyaanController.findById);

// UPDATE
router.put("/:id", pertanyaanController.update);

// DELETE
router.delete("/:id", pertanyaanController.remove);

module.exports = router;
