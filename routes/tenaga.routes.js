const express = require("express");
const router = express.Router();
const tenagaController = require("../controllers/tenaga.controller");

// CREATE
router.post("/", tenagaController.create);

// READ ALL
router.get("/", tenagaController.findAll);

// SEARCH (POST)
router.post("/search", tenagaController.search);

// READ BY NI
router.get("/:ni", tenagaController.findByNI);

// UPDATE
router.put("/:ni", tenagaController.update);

// DELETE
router.delete("/:ni", tenagaController.remove);

module.exports = router;
