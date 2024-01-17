const Building = require("../models/Building");
const Door = require("../models/Door");
const Owner = require("../models/Owner");
const Incidence = require("../models/Incidence");
require("dotenv").config();

const fs = require("fs").promises;
const path = require("path");
const incidenceDataPath = path.join(__dirname, "../data/incidenceData.json");

const fetchMessages = async () => {
  try {
    const data = await fs.readFile(incidenceDataPath, "utf-8");
    console.log("Read data from incidenceData.json", data);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al hacer el fetchMessages", error);
    throw error;
  }
};

const updateMessageState = async (messageId, newState) => {
  try {
    const messages = await fetchMessages();
    const updatedMessages = messages.map((message) => {
      if (message.id === messageId) {
        return { ...message, status: newState };
      }
      return message;
    });
    await fs.writeFile(
      incidenceDataPath,
      JSON.stringify(updatedMessages, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error en updateMessageState", error);
    throw error;
  }
};

const transformMessageToIncidence = (message) => ({
  summary: message.summary,
  category: message.category,
  originalMessage: message.summary,
  status: "received",
});

const IncidenceController = {
  async fetchAndCreateIncidences(req, res, next) {
    try {
      const messages = await fetchMessages();
      if (messages.length === 0) {
        return [];
      }
      const filteredMessages = messages.filter(
        (message) => message.status === "delivered"
      );
      const createdIncidences = [];
      for (const message of filteredMessages) {
        const incidenceData = transformMessageToIncidence(message);
        const incidence = await Incidence.create(incidenceData);
        await updateMessageState(message.id, "received");
        createdIncidences.push(incidence);
      }
      res
        .status(201)
        .send({ message: "Incidencia creada exitosamente", createdIncidences });
    } catch (error) {
      next(error);
    }

    //   console.log("Fetching messages...");
    //   const data = await fs.readFile(incidenceDataPath, 'utf-8');
    //   const messages = JSON.parse(data);

    //   if (messages.length === 0) {
    //     console.log("No messages to process");
    //     return [];
    //   }

    //   const createdIncidences = [];

    //   for (const message of messages) {
    //     const incidenceData = {
    //       summary: message.Incidencia,
    //       category: message.Categoría,
    //       originalMessage: message.Incidencia,
    //       status: message.EstadoIncidencia,
    //     };

    //     const incidence = await Incidence.create(incidenceData);
    //     createdIncidences.push(incidence);
    //   }

    //   console.log(`${createdIncidences.length} incidences created`);
    //   console.log(createdIncidences);
    //   return createdIncidences;
    // } catch (error) {
    //   console.error('Error in fetchAndCreateIncidences:', error);
    //   throw error;
    // }
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
        // populate: {
        //   path: "doorIds",
        //   select: "incidenceIds"
        // }
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
      res.send({ message: "Incidencias eliminadas exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error eliminando las incidencias" });
    }
  },
};

module.exports = IncidenceController;
