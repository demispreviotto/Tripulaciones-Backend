const express = require("express");
const router = express.Router();

const DoorController = require("../controllers/DoorController");
const { authentication } = require("../middleware/authentication");

router.post("/create", authentication, DoorController.createDoor);
router.get("/getAll", authentication, DoorController.getAllDoors);
router.get("/getById/:id", authentication, DoorController.getDoorById);
router.put("/update/:id", authentication, DoorController.updateDoorById);
router.delete("/delete/:id", authentication, DoorController.deleteDoorById);

module.exports = router;
