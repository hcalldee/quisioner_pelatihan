const express = require("express");
const router = express.Router();
const transactJawabanController = require(
  "../controllers/transactJawaban.controller"
);
const validate = require("../middleware/validate");
const { transactJawabanSchemas } = require("../validators/api.schemas");
const authOrAppKey = require("../middleware/authOrAppKey");

// CREATE
router.post("/", validate(transactJawabanSchemas.create), transactJawabanController.create);

// READ ALL BY TRANSACT ID
router.get(
  "/transact/:id_transact",
  transactJawabanController.findByTransactId
);

// READ BY ID
router.get("/:id", transactJawabanController.findById);

// UPDATE
router.put("/:id", validate(transactJawabanSchemas.update), transactJawabanController.update);

// DELETE BY ID
router.delete("/:id", transactJawabanController.remove);

// DELETE BY TRANSACT ID
router.delete(
  "/transact/:id_transact",
  transactJawabanController.removeByTransactId
);

router.post("/bulk", authOrAppKey, validate(transactJawabanSchemas.bulk), transactJawabanController.bulkCreate);

module.exports = router;
