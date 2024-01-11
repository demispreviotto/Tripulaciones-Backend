const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/ServiceController');

router.post('/services', ServiceController.createService);
router.get('/services', ServiceController.getAllServices);
router.get('/services/:id', ServiceController.getServiceById);
router.put('/services/:id', ServiceController.updateServiceById);
router.delete('/services/:id', ServiceController.deleteServiceById);

module.exports = router;
