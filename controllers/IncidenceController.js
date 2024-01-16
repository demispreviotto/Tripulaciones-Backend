const Building = require("../models/Building");
const Door = require("../models/Door");
const Owner = require("../models/Owner");
const Incidence = require("../models/Incidence");
require("dotenv").config();

const IncidenceController = {
  async createIncidence(req, res, next) {
    try {
      const incidence = Incidence.create();
      // atacar api de la ia
      res.status(201).send(incidence);
    } catch (error) {
      next(error);
    }
  },
  async createManualIncidence(req, res, next) {
    try {
      const {
        summary,
        category,
        originalMessage,
        status,
        doorIds,
        buildingId,
        ownerIds,
      } = req.body;
      const incidence = await Incidence.create({
        summary,
        category,
        originalMessage,
        status,
        doorIds,
        buildingId,
        ownerIds,
      });
      if (buildingId) {
        const building = await Building.findById(buildingId);
        if (building) {
          building.incidenceIds.push(incidence._id);
          await building.save();
        }
      }
      if (doorIds && doorIds.length > 0) {
        const doors = await Door.find({ _id: { $in: doorIds } });
        doors.forEach((door) => {
          door.incidenceIds.push(incidence._id);
          door.save();
        });
      }
      if (ownerIds && ownerIds.length > 0) {
        const owners = await Owner.find({ _id: { $in: ownerIds } });
        owners.forEach((owner) => {
          owner.incidenceIds.push(incidence._id);
          owner.save();
        });
      }
      res
        .status(201)
        .send({ message: "Incidencia creada exitosamente", incidence });
    } catch (error) {
      next(error);
    }
  },
  async getAllIncidences(req, res) {
    try {
      const incidences = await Incidence.find().populate({
        path: "buildingId",
        select: "address number",
      });
      res.send(incidences);
      if (incidences.length < 1) {
        return res.send({ message: "No hay incidencias" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Error en la búsqueda de las incidencias" });
    }
  },
  async getIncidenceById(req, res) {
    try {
      const incidence = await Incidence.findById(req.params.id);
      if (!incidence) {
        return res.status(404).send({ message: "Incidencia no encontrada" });
      }
      res.send(incidence);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Error en la búsqueda de la incidencia" });
    }
  },
  async updateIncidence(req, res) {
    try {
      const incidence = await Incidence.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      if (!incidence) {
        return res.status(404).send({ message: "Incidencia no encontrada" });
      }
      res.send({ message: "Incidencia modificada exitosamente", incidence });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error modificando la incidencia" });
    }
  },
  async deleteIncidence(req, res) {
    try {
      const incidence = await Incidence.findByIdAndDelete(req.params.id);
      if (!incidence) {
        return res.status(404).send({ message: "Incidencia no encontrada" });
      }
      res
        .status(200)
        .send({ message: "Incidencia eliminada exitosamente", incidence });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error eliminando la incidencia" });
    }
  },
};

module.exports = IncidenceController;
