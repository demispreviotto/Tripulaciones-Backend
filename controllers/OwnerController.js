const Building = require("../models/Building");
const Door = require("../models/Door");
const Incidence = require("../models/Incidence");
const Owner = require("../models/Owner");
require("dotenv").config();

const OwnerController = {
  async create(req, res, next) {
    try {
      const { firstName, lastName, phone, email, doorIds, buildingId } =
        req.body;
      const owner = await Owner.create({
        firstName,
        lastName,
        phone,
        email,
        doorIds,
        buildingId,
      });
      if (doorIds) {
        const door = await Door.findById(doorIds);
        if (door) {
          door.ownerIds.push(owner._id);
          await door.save();
        }
      }
      if (buildingId) {
        const building = await Building.findById(buildingId);
        if (building) {
          building.ownerIds.push(owner._id);
          await building.save();
        }
      }
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
  async deleteAll(req, res) {
    try {
      await Owner.deleteMany();
      await Door.updateMany({}, { $set: { doorIds: [] } });
      await Incidence.updateMany({}, { $set: { incidenceIds: [] } });
      await Building.updateMany({}, { $set: { buildingIds: [] } });
      res.send({ message: "Propietarios eliminados exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error eliminando los propietarios" });
    }
  },
};

module.exports = OwnerController;
