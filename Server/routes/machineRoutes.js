const express = require('express');
const router = express.Router();
const {
  getMachines,
  getMachine,
  createMachine,
  updateMachine,
  deleteMachine
} = require('../controllers/machineController');

const { upload } = require('../config/cloudinary'); 

// Public routes
router.route('/').get(getMachines);
router.route('/:id').get(getMachine);


router.route('/')
  .post(upload.single('machineImage'), createMachine); // Upload single image

router.route('/:id')
  .put(upload.single('machineImage'), updateMachine) // Upload image on update
  .delete(deleteMachine);

module.exports = router;
