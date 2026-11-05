const express = require('express');
const router = express.Router();
const gedungController = require('../controllers/GedungController');
const cekApiKey = require('../middleware/cekApiKey');

router.get('/', gedungController.getAll);
router.get('/:id', gedungController.getById);
router.post('/', cekApiKey, gedungController.create);
router.put('/:id', cekApiKey, gedungController.update);
router.delete('/:id', cekApiKey, gedungController.remove);

module.exports = router;
