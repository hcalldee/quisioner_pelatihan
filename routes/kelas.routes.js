const express = require('express');
const router = express.Router();
const KelasController = require('../controllers/kelas.controller');
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { kelasSchemas } = require("../validators/api.schemas");

// Protect all kelas endpoints
router.use(auth);

router.get('/', KelasController.getAll);        // + search
router.get('/:id', KelasController.getById);
router.post('/', validate(kelasSchemas.create), KelasController.create);
router.put('/:id', validate(kelasSchemas.update), KelasController.update);
router.delete('/:id', KelasController.remove);

module.exports = router;
