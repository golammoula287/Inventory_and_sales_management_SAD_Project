const express = require('express');
const {
  createGodown,
  getGodowns,
  getGodown,
  updateGodown,
  deleteGodown,
} = require('../controllers/godownController');

const router = express.Router();

router.post('/', createGodown);
router.get('/', getGodowns);
router.get('/:godown_id', getGodown);
router.put('/:godown_id', updateGodown);
router.delete('/:godown_id', deleteGodown);

module.exports = router;
