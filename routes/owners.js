const express = require("express");
const router = express.Router();

const OwnerController = require("../controllers/OwnerController");
const { authentication, isAdmin } = require("../middleware/authentication");

router.post("/create", authentication, OwnerController.create);
router.get("/getAll", OwnerController.getAll);
router.delete("/delete/:_id", authentication, OwnerController.delete);
router.put("/update/:_id", authentication, OwnerController.update);
router.delete("/deleteAll/", authentication, OwnerController.deleteAll);

module.exports = router;
