require("dotenv").config();
const Building = require("../models/Building");
const Owner = require("../models/Owner");
const Service = require("../models/Service");
const Todo = require("../models/Todo");
const User = require("../models/User");
const Door = require("../models/Door");
const Incidence = require("../models/Incidence");

const BuildingController = {
  async createBuilding(req, res, next) {
    try {
      const userId = req.user.id;
      const building = new Building({
        ...req.body,
        createdBy: userId,
      });
      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { buildingIds: building._id } },
        { new: true }
      );
      await building.save();
      res.status(201).send({ message: "Finca creada exitosamente", building });
    } catch (error) {
      next(error);
    }
  },
  async getAllBuildings(req, res) {
    try {
      const buildings = await Building.find()
        .populate({
          path: "incidenceIds",
          select: "status",
        })
        .populate({
          path: "todoIds",
          select: "title description completed",
        });
      res.send(buildings);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error en la búsqueda de las fincas" });
    }
  },
  async getBuildingById(req, res) {
    try {
      const building = await Building.findById(req.params.id)
        .populate({
          path: "ownerIds",
          select: "firstName lastName",
        })
        .populate({
          path: "incidenceIds",
          select: "summary category status createdAt", // Update the select fields
          model: "Incidence",
        });
      if (!building) {
        return res.status(404).send({ message: "Finca no encontrada" });
      }
      res.send(building);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error en la búsqueda de la finca" });
    }
  },
  async updateBuildingById(req, res) {
    try {
      const building = await Building.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!building) {
        return res.status(404).send({ message: "Finca no encontrada" });
      }
      res.send({ message: "Finca modificada exitosamente", building });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error modificando la finca" });
    }
  },
  async deleteBuildingById(req, res) {
    try {
      const building = await Building.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .send({ message: "Finca eliminada exitosamente", building });
      if (!building) {
        return res.status(404).send({ message: "Finca no encontrada" });
      }
      res.send(building);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error eliminando la finca" });
    }
  },
  async deleteAll(req, res) {
    try {
      await Building.deleteMany();
      await Service.updateMany({}, { $set: { serviceIds: [] } });
      await Door.updateMany({}, { $set: { doorIds: [] } });
      await Incidence.updateMany({}, { $set: { incidenceIds: [] } });
      await Todo.updateMany({}, { $set: { todoIds: [] } });
      await Owner.updateMany({}, { $set: { ownerIds: [] } });
      res.send({ message: "Fincas eliminadas exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error eliminando las fincas" });
    }
  },
};
module.exports = BuildingController;
