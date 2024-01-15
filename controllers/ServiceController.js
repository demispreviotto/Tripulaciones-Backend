const Service = require("../models/Service");

const ServiceController = {
  async createService(req, res, next) {
    try {
      const service = new Service(req.body);
      await service.save();
      res
        .status(201)
        .send({ message: "Servicio creado exitosamente", service });
    } catch (error) {
      next(error);
    }
  },
  async getAllServices(req, res) {
    try {
      const services = await Service.find();
      res.send(services);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Error en la búsqueda de los servicios" });
    }
  },
  async getServiceById(req, res) {
    try {
      const service = await Service.findById(req.params.id);
      if (!service) {
        return res.status(404).send({ message: "Servicio no encontrado" });
      }
      res.send(service);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Error en la búsqueda de los servicios" });
    }
  },
  async updateServiceById(req, res) {
    try {
      const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!service) {
        return res.status(404).send({ message: "Servicio no encontrado" });
      }
      res.send({ message: "Servicio modificado exitosamente", service });
    } catch (error) {
      console.error(error);
      res.status(400).send({ message: "Error modificando el servicio" });
    }
  },
  async deleteServiceById(req, res) {
    try {
      const service = await Service.findByIdAndDelete(req.params.id);
      if (!service) {
        return res.status(404).send({ error: "Servicio no encontrado" });
      }
      res.send({ message: "Servicio eliminado exitosamente", service });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error eliminando el servicio" });
    }
  },
};
module.exports = ServiceController;
