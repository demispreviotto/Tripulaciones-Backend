const BuildingController = require("../controllers/BuildingController");
const { authentication } = require("../middleware/authentication");

const express = require('express');
const router = express.Router();
// Routes
router.post('/buildings', BuildingController.createBuilding);
router.get('/buildings', BuildingController.getAllBuildings);
router.get('/buildings/:id', BuildingController.getBuildingById);
router.put('/buildings/:id', BuildingController.updateBuildingById);
router.delete('/buildings/:id', BuildingController.deleteBuildingById);

module.exports = router;

