const express = require("express");
const router = express.Router();

const OwnerController = require("../controllers/OwnerController");
const { authentication, isAdmin } = require("../middleware/authentication");

router.post("/create", authentication, isAdmin, OwnerController.create);
router.get("/getAll", authentication, isAdmin, OwnerController.getAll);
router.delete("/delete/:_id", authentication, isAdmin, OwnerController.delete);
router.put("/update/:_id", authentication, isAdmin, OwnerController.update);

module.exports = router;
