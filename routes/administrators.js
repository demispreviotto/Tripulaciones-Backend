const express = require("express");
const router = express.Router();

const AdministratorController = require("../controllers/AdministratorController");
const {
  AdministratorAuthentication,
  isSuperAdmin,
  isAdministrator,
} = require("../middleware/authentication");

router.post("/register", AdministratorController.register);
router.post("/login", AdministratorController.login);
router.get(
  "/getAll",
  AdministratorAuthentication,
  isAdministrator || isSuperAdmin,
  AdministratorController.getAll
);
// router.delete("/deleteOne", AdministratorAuthentication, AdministratorController.deleteOne);
router.delete(
  "/logout",
  AdministratorAuthentication,
  isAdministrator,
  AdministratorController.logout
);
router.get("/profile", AdministratorAuthentication, AdministratorController.getLoggedAdministrator);
// router.put("/update", AdministratorAuthentication, AdministratorController.update);

module.exports = router;
