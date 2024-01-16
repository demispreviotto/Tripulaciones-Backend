const Door = require("../models/Door");
const Building = require("../models/Building");
const Owner = require("../models/Owner");

const DoorController = {
  async createDoor(req, res, next) {
    try {
      const { name, buildingId, ownerIds } = req.body;
      const door = new Door({ name, buildingId, ownerIds });
      if (buildingId) {
        const building = await Building.findById(buildingId);
        if (building) {
          building.doorIds.push(door._id);
          await building.save();
        }
      }
      if (ownerIds) {
        const owner = await Owner.findById(ownerIds);
        if (owner) {
          owner.doorIds.push(door._id);
          await owner.save();
        }
      }
      await door.save();
      res.status(201).send({ message: "Puerta creada exitosamente", door });
    } catch (error) {
      next(error);
    }
  },
  async getAllDoors(req, res) {
    try {
      const doors = await Door.find();
      res.send(doors);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error en la búsqueda de las puertas" });
    }
  },
  async getDoorById(req, res) {
    try {
      const door = await Door.findById(req.params.id);
      if (!door) {
        return res.status(404).send({ message: "Puerta no encontrada" });
      }
      res.send(door);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error en la búsqueda de la puerta" });
    }
  },
  async updateDoorById(req, res) {
    try {
      const door = await Door.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!door) {
        return res.status(404).send({ message: "Puerta no encontrada" });
      }
      res.send({ message: "Puerta modificada exitosamente", door });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error modificando la puerta" });
    }
  },
  async deleteDoorById(req, res) {
    try {
      const door = await Door.findByIdAndDelete(req.params.id);
      if (!door) {
        return res.status(404).send({ message: "Puerta no encontrada" });
      }
      res.send({ message: "Puerta eliminada exitosamente", door });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error eliminando la puerta" });
    }
  },
};
module.exports = DoorController;
