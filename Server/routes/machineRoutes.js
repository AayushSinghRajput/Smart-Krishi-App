const express = require('express');
const router = express.Router();
const {
  getMachines,
  getMachine,
  createMachine,
  updateMachine,
  deleteMachine
} = require('../controllers/machineController');


// Public routes
router.route('/')
  .get(getMachines);

router.route('/:id')
  .get(getMachine);



router.route('/')
  .post(createMachine);

router.route('/:id')
  .put(updateMachine)
  .delete(deleteMachine);

module.exports = router;