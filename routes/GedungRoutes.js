const express = require('express');
const router = express.Router();
const instrukturController = require('../controllers/GedungController');
const cekApiKey = require('../middleware/cekApiKey');

router.get('/', instrukturController.getAll);
router.get('/:id', instrukturController.getById);
router.post('/', cekApiKey, instrukturController.create);
router.put('/:id', cekApiKey, instrukturController.update);
router.delete('/:id', cekApiKey, instrukturController.remove);

module.exports = router;
