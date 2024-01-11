const express = require("express");
const router = express.Router();

const IncidenceController = require("../controllers/IncidenceController");
const { authentication, isAdmin } = require("../middleware/authentication");

router.post("/create", IncidenceController.create);
router.get("/getAll", authentication, isAdmin, IncidenceController.getAll);

module.exports = router;
