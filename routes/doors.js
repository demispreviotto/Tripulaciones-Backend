const express = require('express');
const router = express.Router();
const DoorController = require('../controllers/DoorController');

router.post('/doors', DoorController.createDoor);
router.get('/doors', DoorController.getAllDoors);
router.get('/doors/:id', DoorController.getDoorById);
router.put('/doors/:id', DoorController.updateDoorById);
router.delete('/doors/:id', DoorController.deleteDoorById);

module.exports = router;
