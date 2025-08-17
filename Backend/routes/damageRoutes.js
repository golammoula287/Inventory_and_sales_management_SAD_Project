const express = require('express');
const { recordDamage, getDamages, getDamage, updateDamage, deleteDamage } = require('../controllers/damageController');
const router = express.Router();

router.post('/', recordDamage);
router.get('/', getDamages);
router.get('/:damage_id', getDamage);
router.put('/:damage_id', updateDamage);
router.delete('/:damage_id', deleteDamage);

module.exports = router;
