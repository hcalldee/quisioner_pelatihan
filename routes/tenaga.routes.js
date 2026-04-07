const express = require("express");
const router = express.Router();
const tenagaController = require("../controllers/tenaga.controller");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { tenagaSchemas } = require("../validators/api.schemas");

// Protect all tenaga endpoints
router.use(auth);

// CREATE
router.post("/", validate(tenagaSchemas.create), tenagaController.create);

// READ ALL
router.get("/", tenagaController.findAll);

// SEARCH (POST)
router.post("/search", validate(tenagaSchemas.search), tenagaController.search);

// READ BY NI
router.get("/:ni", tenagaController.findByNI);

// UPDATE
router.put("/:ni", validate(tenagaSchemas.update), tenagaController.update);

// DELETE
router.delete("/:ni", tenagaController.remove);

module.exports = router;
