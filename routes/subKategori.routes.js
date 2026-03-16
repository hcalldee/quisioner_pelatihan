const express = require("express");
const router = express.Router();
const subKategoriController = require("../controllers/subKategori.controller");

// CREATE
router.post("/", subKategoriController.create);

// READ ALL
router.get("/", subKategoriController.findAll);

// SEARCH (POST)
router.post("/search", subKategoriController.search);

// READ BY ID
router.get("/:id", subKategoriController.findById);

// UPDATE
router.put("/:id", subKategoriController.update);

// DELETE
router.delete("/:id", subKategoriController.remove);

module.exports = router;
