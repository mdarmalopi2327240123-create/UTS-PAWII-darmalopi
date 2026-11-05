const express = require('express');
const router = express.Router();
const kamarController = require('../controllers/KamarController');
const cekApiKey = require('../middleware/cekApiKey');

router.get('/', kamarController.getAll);
router.get('/:id', kamarController.getById);
router.post('/', cekApiKey, kamarController.create);
router.put('/:id', cekApiKey, kamarController.update);
router.delete('/:id', cekApiKey, kamarController.remove);

module.exports = router;
