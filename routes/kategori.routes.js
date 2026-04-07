const express = require('express');
const router = express.Router();
const controller = require('../controllers/kategori.controller');
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { kategoriSchemas } = require("../validators/api.schemas");

// Protect all kategori endpoints
router.use(auth);

router.get('/', controller.getAll);
router.get('/view/', controller.getVwKategori);
router.get('/:id', controller.getById);
router.post('/', validate(kategoriSchemas.create), controller.create);
router.put('/:id', validate(kategoriSchemas.update), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
