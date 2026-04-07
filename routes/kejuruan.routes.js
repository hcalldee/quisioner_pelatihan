const express = require('express');
const router = express.Router();
const KejuruanController = require('../controllers/kejuruan.controller');
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { kejuruanSchemas } = require("../validators/api.schemas");

// Protect all kejuruan endpoints
router.use(auth);

router.get('/', KejuruanController.getAll);       // + search
router.get('/:id', KejuruanController.getById);
router.post('/', validate(kejuruanSchemas.create), KejuruanController.create);
router.put('/:id', validate(kejuruanSchemas.update), KejuruanController.update);
router.delete('/:id', KejuruanController.remove);

module.exports = router;
