const express = require("express");
const router = express.Router();
const masterSiController = require("../controllers/masterSi.controller");

// CREATE
router.post("/", masterSiController.create);

// READ ALL (pagination only)
router.get("/", masterSiController.findAll);

// SEARCH (POST)
router.post("/search", masterSiController.search);

// READ BY ID
router.get("/:id", masterSiController.findById);

// UPDATE
router.put("/:id", masterSiController.update);

// DELETE
router.delete("/:id", masterSiController.remove);

module.exports = router;
