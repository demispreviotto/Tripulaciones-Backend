const Building = require("../models/Building");
const Door = require("../models/Door");
const Owner = require("../models/Owner");
const Incidence = require("../models/Incidence");
require("dotenv").config();

const fs = require("fs").promises;
const path = require("path");
const incidenceDataPath = path.join(__dirname, "../data/json_inc.json");

const fetchMessages = async () => {
  try {
    const data = await fs.readFile(incidenceDataPath, "utf-8");
    console.error("Información leída de incidenceData.json", data);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al hacer el fetchMessages", error);
    throw error;
  }
};

const updateMessageStatus = async (indices) => {
  try {
    const messages = await fetchMessages();
    indices.forEach((index) => {
      const message = messages.find((msg) => msg.index === index);
      if (message) {
        message.status = "received";
      }
    });
    await fs.writeFile(
      incidenceDataPath,
      JSON.stringify(messages, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error en updateMessageStatus", error);
    throw error;
  }
};

const transformMessageToIncidence = (message) => ({
  summary: message.summary,
  category: message.category,
  originalMessage: message.summary,
  status: "received",
  index: message.index,
});

const IncidenceController = {
  async fetchAndCreateIncidences(req, res, next) {
    try {
      const messages = await fetchMessages();
      if (messages.length === 0) {
        return res.status(200).send({ message: "Sin mensajes para procesar" });
      }
      const filteredMessages = messages.filter(
        (message) => message.status === "delivered"
      );
      const incidencesToCreate = [];
      for (const message of filteredMessages) {
        const incidenceData = transformMessageToIncidence(message);
        const existingIncidence = await Incidence.findOne(incidenceData);
        if (existingIncidence) {
          console.log("La incidencia ya existe para este mensaje:", message);
          continue;
        }
        incidencesToCreate.push(incidenceData);
        const owner = await Owner.findOne({ phone: message.phone });
        if (owner) {
          incidenceData.ownerIds = owner._id;
          console.error(incidenceData.ownerIds);
        }
      }
      console.log("Incidencias por crear:", incidencesToCreate);
      if (incidencesToCreate.length > 0) {
        console.log("Attempting to create incidences...");
        const createdIncidences = await Promise.all(
          incidencesToCreate.map(async (incidenceData) => {
            const incidence = await Incidence.create(incidenceData);
            return incidence;
          })
        );
        console.log("Incidencias creadas:", createdIncidences);
        const indicesToUpdate = createdIncidences.map(
          (incidence) => incidence.index
        );
        messages.forEach((message) => {
          if (indicesToUpdate.includes(message.index)) {
            message.status = "received";
          }
        });
        await fs.writeFile(
          incidenceDataPath,
          JSON.stringify(messages, null, 2),
          "utf-8"
        );
        res
          .status(201)
          .send({
            message: "Incidencias creadas exitosamente",
            createdIncidences,
          });
      } else {
        res.status(200).send({ message: "No hay nuevas incidencias por crear" });
      }
    } catch (error) {
      next(error);
    }
  },
  async createManualIncidence(req, res) {
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
        .send({ message: "Incidencia manual creada exitosamente", incidence });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Error creando manualmente la incidencia" });
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
      res.status(500).send({ message: "Error en la búsqueda de incidencias" });
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
  async getIncidencesByBuilding(req, res) {
    try {
      const buildingId = req.params.buildingId;
      const building = await Building.findById(buildingId);
      if (!building) {
        return res.status(404).send({ message: "Finca no encontrada" });
      }
      const incidences = await Incidence.find({
        _id: { $in: building.incidenceIds },
      });
      res.send(incidences);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Error obteniendo incidencias por finca" });
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
        return res
          .status(404)
          .send({ message: "Incidencia no encon not found" });
      }
      res
        .status(200)
        .send({ message: "Incidencia eliminada exitosamente", incidence });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error eliminando la incidencia" });
    }
  },
  async deleteAll(req, res) {
    try {
      await Incidence.deleteMany();
      await Door.updateMany({}, { $set: { incidenceIds: [] } });
      await Building.updateMany({}, { $set: { incidenceIds: [] } });
      await Owner.updateMany({}, { $set: { incidenceIds: [] } });
      res.send({ message: "Incidencias eliminadas exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error eliminando las incidencias" });
    }
  },
};

module.exports = IncidenceController;
