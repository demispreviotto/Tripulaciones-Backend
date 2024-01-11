const BuildingController = require("../controllers/BuildingController");
const { authentication, isAdmin } = require("../middleware/authentication");

const express = require("express");
const router = express.Router();

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
