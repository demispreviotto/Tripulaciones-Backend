const Service = require("../models/Service");

const ServiceController = {
  async createService(req, res) {
    try {
      const service = new Service(req.body);
      await service.save();
      res
        .status(201)
        .send({ message: "Service created successfully", service });
    } catch (error) {
      res
        .status(400)
        .send({ message: "Unexpected error creating the service" });
    }
  },
  async getAllServices(req, res) {
    try {
      const services = await Service.find();
      res.send(services);
    } catch (error) {
      res
        .status(500)
        .send({ message: "Unexpected error looking for the services" });
    }
  },
  async getServiceById(req, res) {
    try {
      const service = await Service.findById(req.params.id);
      if (!service) {
        return res.status(404).send({ message: "Service not found" });
      }
      res.send(service);
    } catch (error) {
      res
        .status(500)
        .send({ message: "Unexpected error looking for the service" });
    }
  },
  async updateServiceById(req, res) {
    try {
      const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!service) {
        return res.status(404).send({ message: "Service not found" });
      }
      res.send({ message: "Service updated successfully", service });
    } catch (error) {
      res
        .status(400)
        .send({ message: "Unexpected error updating the service" });
    }
  },
  async deleteServiceById(req, res) {
    try {
      const service = await Service.findByIdAndDelete(req.params.id);
      if (!service) {
        return res.status(404).send({ error: "Service not found" });
      }
      res.send({ message: "Service deleted successfully", service });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Unexpected error deleting the service" });
    }
  },
};
module.exports = ServiceController;
