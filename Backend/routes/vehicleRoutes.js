const express = require('express');
const {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');

const router = express.Router();

router.post('/', createVehicle);
router.get('/', getVehicles);
router.get('/:vehicle_id', getVehicle);
router.put('/:vehicle_id', updateVehicle);
router.delete('/:vehicle_id', deleteVehicle);

module.exports = router;
