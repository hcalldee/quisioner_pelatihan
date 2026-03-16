const express = require('express');
const router = express.Router();
const KejuruanController = require('../controllers/kejuruan.controller');

router.get('/', KejuruanController.getAll);       // + search
router.get('/:id', KejuruanController.getById);
router.post('/', KejuruanController.create);
router.put('/:id', KejuruanController.update);
router.delete('/:id', KejuruanController.remove);

module.exports = router;