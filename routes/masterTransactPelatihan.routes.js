const express = require("express");
const router = express.Router();
const masterTransactPelatihanController = require(
  "../controllers/masterTransactPelatihan.controller"
);

// CREATE
router.post("/", masterTransactPelatihanController.create);

// READ ALL
router.get("/", masterTransactPelatihanController.findAll);

// SEARCH (by nama_pelatihan)
router.post("/search", masterTransactPelatihanController.search);

// READ BY ID
router.get("/:id", masterTransactPelatihanController.findById);

// UPDATE
router.put("/:id", masterTransactPelatihanController.update);

// DELETE
router.delete("/:id", masterTransactPelatihanController.remove);

module.exports = router;
