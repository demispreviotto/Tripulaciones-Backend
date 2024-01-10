const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const {
  UserAuthentication,
  isSuperAdmin,
  isAdministrator,
} = require("../middleware/authentication");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get(
  "/getAll",
  UserAuthentication,
  isAdministrator || isSuperAdmin,
  UserController.getAll
);
router.delete("/deleteOne", UserAuthentication, UserController.deleteOne);
router.delete("/logout", UserAuthentication, UserController.logout);
router.get("/profile", UserAuthentication, UserController.getLoggedUser);
router.put("/update", UserAuthentication, UserController.update);

module.exports = router;
