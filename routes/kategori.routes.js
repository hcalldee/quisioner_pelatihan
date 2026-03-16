const express = require('express');
const router = express.Router();
const controller = require('../controllers/kategori.controller');

router.get('/', controller.getAll);
router.get('/view/', controller.getVwKategori);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
