const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const { authentication, isAdmin } = require("../middleware/authentication");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/getAll", UserController.getAll);
router.delete("/deleteOne", authentication, UserController.deleteOne);
router.delete("/logout", authentication, UserController.logout);
router.get("/profile", authentication, UserController.getLoggedUser);
router.put("/update", authentication, UserController.update);

module.exports = router;
