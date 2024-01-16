const Building = require("../models/Building");
const Door = require("../models/Door");
const Owner = require("../models/Owner");
const Incidence = require("../models/Incidence");
require("dotenv").config();

const fs = require('fs').promises;
const path = require('path');
const incidenceDataPath = path.join(__dirname, '../data/incidenceData.json')

const fetchMessages = async () => {
  try {
    // Read data from incidenceData.json
    const data = await fs.readFile(incidenceDataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error in fetchMessages:', error);
    throw error;
  }
};

const updateMessageState = async (messageId, newState) => {
  try {
    // Assuming you have a function to find and update the state of a message in the data file
    const messages = await fetchMessages();
    const updatedMessages = messages.map((message) => {
      if (message.id === messageId) {
        return { ...message, state: newState };
      }
      return message;
    });

    // Update the data file with the modified messages
    await fs.writeFile(incidenceDataPath, JSON.stringify(updatedMessages, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error in updateMessageState:', error);
    throw error;
  }
};

const transformMessageToIncidence = (message) => ({
  summary: message.summary,
  category: message.category,
  originalMessage: message.originalMessage,
  status: 'received', // Set the status to "received" or any other desired value
  doorIds: message.doorIds,
  buildingId: message.buildingId,
  ownerIds: message.ownerIds,
});

const IncidenceController = {
  async fetchAndCreateIncidences() {
    try {
      // Fetch messages from wherever you are getting them
      const messages = await fetchMessages();

      if (messages.length === 0) {
        console.log("No messages to process");
        return [];
      }

      // Filter messages based on some criteria (e.g., state is "previous to received")
      const filteredMessages = messages.filter((message) => message.state === "delivered");
      const createdIncidences = [];

      for (const message of filteredMessages) {
        const incidenceData = transformMessageToIncidence(message);
        const incidence = await Incidence.create(incidenceData);
        await updateMessageState(message.id, 'received');
        createdIncidences.push(incidence);
      }

      return createdIncidences;
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
