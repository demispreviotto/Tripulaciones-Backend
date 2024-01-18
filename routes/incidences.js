const express = require("express");
const router = express.Router();

const IncidenceController = require("../controllers/IncidenceController");
const { authentication } = require("../middleware/authentication");

router.post("/fetchAndCreateIncidences", IncidenceController.fetchAndCreateIncidences);
router.post("/createManualIncidence", authentication, IncidenceController.createManualIncidence);
router.get("/getAllIncidences", IncidenceController.getAllIncidences);
router.get("/getIncidenceById/:id", authentication, IncidenceController.getIncidenceById);
router.get("/getIncidencesByBuilding", IncidenceController.getIncidencesByBuilding);
router.put("/updateIncidence/:id", authentication, IncidenceController.updateIncidence);
router.delete("/deleteIncidence/:id", authentication, IncidenceController.deleteIncidence);
router.delete("/deleteAll", authentication, IncidenceController.deleteAll);
module.exports = router;
