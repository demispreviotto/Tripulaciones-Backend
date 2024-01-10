const express = require("express");
const router = express.Router();

const AdministratorController = require("../controllers/AdministratorController");
const {
  authentication,
  isSuperAdmin,
  isAdministrator,
} = require("../middleware/authentication");

router.post("/register", AdministratorController.register);
// router.post("/login", AdministratorController.login);
router.get("/getAll",  AdministratorController.getAll);
// router.delete("/deleteOne", authentication, AdministratorController.deleteOne);
// router.delete("/logout", authentication, AdministratorController.logout);
// router.get("/profile", authentication, AdministratorController.getLoggedAdministrator);
// router.put("/update", authentication, AdministratorController.update);

module.exports = router;
