const express = require('express');
const router = express.Router();
const KomentarController = require('../controllers/komentar.controller');
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { komentarSchemas } = require("../validators/api.schemas");

// Protect all komentar endpoints
router.use(auth);

router.get('/', KomentarController.getAll);        // + search
router.get('/:id', KomentarController.getById);
router.post('/detail', validate(komentarSchemas.detail), KomentarController.detail);
router.post('/', validate(komentarSchemas.create), KomentarController.create);
router.put('/:id', validate(komentarSchemas.update), KomentarController.update);
router.delete('/:id', KomentarController.remove);

module.exports = router;
