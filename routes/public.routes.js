const express = require("express");
const router = express.Router();

const appKey = require("../middleware/appKey");

// Reuse existing controllers (they don't depend on auth state)
const masterSiController = require("../controllers/masterSi.controller");
const kategoriController = require("../controllers/kategori.controller");
const masterTransactPelatihanController = require("../controllers/masterTransactPelatihan.controller");

router.use(appKey);

// Public read endpoints for app_user (Cordova)
router.get("/master-si", masterSiController.findAll);
router.get("/kategori/view", kategoriController.getVwKategori);
router.get("/master-transact-pelatihan", masterTransactPelatihanController.findAll);
router.get("/master-transact-pelatihan/:id", masterTransactPelatihanController.findById);

module.exports = router;
