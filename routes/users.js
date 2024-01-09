const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const { authentication } = require("../middleware/authentication");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/getAll", UserController.getAll);
router.delete("/deleteOne/:_id", UserController.deleteOne);

module.exports = router;