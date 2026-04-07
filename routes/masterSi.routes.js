const express = require("express");
const router = express.Router();
const masterSiController = require("../controllers/masterSi.controller");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { masterSiSchemas } = require("../validators/api.schemas");

// Protect all master-si endpoints
router.use(auth);

// CREATE
router.post("/", validate(masterSiSchemas.create), masterSiController.create);

// READ ALL (pagination only)
router.get("/", masterSiController.findAll);

// SEARCH (POST)
router.post("/search", validate(masterSiSchemas.search), masterSiController.search);

// READ BY ID
router.get("/:id", masterSiController.findById);

// UPDATE
router.put("/:id", validate(masterSiSchemas.update), masterSiController.update);

// DELETE
router.delete("/:id", masterSiController.remove);

module.exports = router;
