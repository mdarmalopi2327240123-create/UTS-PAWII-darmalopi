const express = require('express');
const router = express.Router();
const kelasBahasaController = require('../controllers/kelasBahasaController');
const cekApiKey = require('../middleware/cekApiKey');

router.get('/', kelasBahasaController.getAll);
router.get('/:id', kelasBahasaController.getById);
router.post('/', cekApiKey, kelasBahasaController.create);
router.put('/:id', cekApiKey, kelasBahasaController.update);
router.delete('/:id', cekApiKey, kelasBahasaController.remove);

module.exports = router;
