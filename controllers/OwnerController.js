const Owner = require("../models/Owner");
require("dotenv").config();

const OwnerController = {
  async create(req, res, next) {
    try {
      const owner = await Owner.create(req.body);
      res
        .status(201)
        .send({ message: "Propietario creado exitosamente", owner });
    } catch (error) {
      next(error);
    }
  },
  async getAll(req, res) {
    try {
      const owners = await Owner.find();
      res.send(owners);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Error en la búsqueda de los propietarios" });
    }
  },
  async delete(req, res) {
    try {
      await Owner.findByIdAndDelete(req.params._id);
      res.send({ message: "Propietario eliminado exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error eliminando al usuario" });
    }
  },
  async update(req, res) {
    try {
      const owner = await Owner.findByIdAndUpdate(req.params._id, req.body, {
        new: true,
      });
      res.send({ message: "Propietario modificado exitosamente", owner });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error modificando al propietario" });
    }
  },
};

module.exports = OwnerController;
