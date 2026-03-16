const express = require("express");
const router = express.Router();
const transactJawabanController = require(
  "../controllers/transactJawaban.controller"
);

// CREATE
router.post("/", transactJawabanController.create);

// READ ALL BY TRANSACT ID
router.get(
  "/transact/:id_transact",
  transactJawabanController.findByTransactId
);

// READ BY ID
router.get("/:id", transactJawabanController.findById);

// UPDATE
router.put("/:id", transactJawabanController.update);

// DELETE BY ID
router.delete("/:id", transactJawabanController.remove);

// DELETE BY TRANSACT ID
router.delete(
  "/transact/:id_transact",
  transactJawabanController.removeByTransactId
);

router.post("/bulk", transactJawabanController.bulkCreate);

module.exports = router;
