const express = require("express");
const router = express.Router();
const subKategoriController = require("../controllers/subKategori.controller");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { subKategoriSchemas } = require("../validators/api.schemas");

// Protect all sub-kategori endpoints
router.use(auth);

// CREATE
router.post("/", validate(subKategoriSchemas.create), subKategoriController.create);

// READ ALL
router.get("/", subKategoriController.findAll);

// SEARCH (POST)
router.post("/search", validate(subKategoriSchemas.search), subKategoriController.search);

// READ BY ID
router.get("/:id", subKategoriController.findById);

// UPDATE
router.put("/:id", validate(subKategoriSchemas.update), subKategoriController.update);

// DELETE
router.delete("/:id", subKategoriController.remove);

module.exports = router;
