const express = require("express");
const router = express.Router();

const BuildingController = require("../controllers/BuildingController");
const { authentication } = require("../middleware/authentication");

router.post("/create", authentication, BuildingController.createBuilding);
router.get("/getAll", authentication, BuildingController.getAllBuildings);
router.get("/getById/:id", authentication, BuildingController.getBuildingById);
router.put(
  "/update/:id",
  authentication,
  BuildingController.updateBuildingById
);
router.delete("/delete/:id", BuildingController.deleteBuildingById);

module.exports = router;
