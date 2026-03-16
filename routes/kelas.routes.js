const express = require('express');
const router = express.Router();
const KelasController = require('../controllers/kelas.controller');

router.get('/', KelasController.getAll);        // + search
router.get('/:id', KelasController.getById);
router.post('/', KelasController.create);
router.put('/:id', KelasController.update);
router.delete('/:id', KelasController.remove);

module.exports = router;
