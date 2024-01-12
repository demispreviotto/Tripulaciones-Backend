const express = require("express");
const router = express.Router();

const IncidenceController = require("../controllers/IncidenceController");
const { authentication } = require("../middleware/authentication");

router.post("/create", IncidenceController.create);
router.get("/getAll", authentication, IncidenceController.getAll);

module.exports = router;
