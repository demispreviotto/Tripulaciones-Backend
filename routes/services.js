const express = require("express");
const router = express.Router();
const ServiceController = require("../controllers/ServiceController");
const { authentication } = require("../middleware/authentication");

router.post("/create", authentication, ServiceController.createService);
router.get("/getAll", ServiceController.getAllServices);
router.get("/getById/:id", authentication, ServiceController.getServiceById);
router.put("/update/:id", authentication, ServiceController.updateServiceById);
router.delete(
  "/delete/:id",
  authentication,
  ServiceController.deleteServiceById
);

module.exports = router;
