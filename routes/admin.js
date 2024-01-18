const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/AdminController");
const { authentication, isAdmin } = require("../middleware/authentication");

router.post("/fetchAndCreateIncidences", authentication, isAdmin, AdminController.fetchAndCreateIncidences)
router.post("/createBuildingsFromJson", authentication, isAdmin, AdminController.fetchAndCreateIncidences)
router.post("/createOwnersFromJson", authentication, isAdmin, AdminController.fetchAndCreateIncidences)
router.post("/mapIncidencesToBuildings", authentication, isAdmin, AdminController.fetchAndCreateIncidences)

module.exports = router;