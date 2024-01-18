const express = require("express");
const router = express.Router();

const BuildingController = require("../controllers/BuildingController");
const { authentication } = require("../middleware/authentication");

router.post("/createBuilding", authentication, BuildingController.createBuilding);
router.get("/getAllBuildings", authentication, BuildingController.getAllBuildings);
router.get("/getBuildingById/:id", authentication, BuildingController.getBuildingById);
router.put("/updateBuilding/:id", authentication, BuildingController.updateBuildingById);
router.delete("/deleteBuildingById/:id", authentication, BuildingController.deleteBuildingById);
router.delete("/deleteAll", authentication, BuildingController.deleteAll);

module.exports = router;
