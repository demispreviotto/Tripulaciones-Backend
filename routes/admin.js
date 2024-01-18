const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/AdminController");
const { authentication, isAdmin } = require("../middleware/authentication");

router.post("/createBuildingsFromJson", authentication, isAdmin, AdminController.createBuildingsFromJson);
router.post("/createOwnersFromJson", authentication, isAdmin, AdminController.createOwnersFromJson);
router.post("/mapIncidencesToBuildings", authentication, isAdmin, AdminController.mapIncidencesToBuildings);

module.exports = router;