const express = require("express");
const router = express.Router();
const masterTransactPelatihanController = require(
  "../controllers/masterTransactPelatihan.controller"
);
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { masterTransactPelatihanSchemas } = require("../validators/api.schemas");

// Protect all master-transact-pelatihan endpoints
router.use(auth);

// CREATE
router.post("/", validate(masterTransactPelatihanSchemas.create), masterTransactPelatihanController.create);

// READ ALL
router.get("/", masterTransactPelatihanController.findAll);

// SEARCH (by nama_pelatihan)
router.post("/search", validate(masterTransactPelatihanSchemas.search), masterTransactPelatihanController.search);

// READ BY ID
router.get("/:id", masterTransactPelatihanController.findById);

// UPDATE
router.put("/:id", validate(masterTransactPelatihanSchemas.update), masterTransactPelatihanController.update);

// DELETE
router.delete("/:id", masterTransactPelatihanController.remove);

module.exports = router;
