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
    const data = await fs.readFile(incidenceDataPath, 'utf-8');
    console.log("Read data from incidenceData.json", data)
    return JSON.parse(data);
  } catch (error) {
    console.error('Error in fetchMessages:', error);
    throw error;
  }
};

const updateMessageState = async (messageId, newState) => {
  try {
    const messages = await fetchMessages();
    console.log("Assuming you have a function to find and update the state of a message in the data file: ", messages)
    // console.log(messages)
    const updatedMessages = messages.map((message) => {
      if (message.id === messageId) {
        return { ...message, status: newState };
      }
      return message;
    });

    console.log("Update the data file with the modified messages")
    await fs.writeFile(incidenceDataPath, JSON.stringify(updatedMessages, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error in updateMessageState:', error);
    throw error;
  }
};

const transformMessageToIncidence = (message) => ({
  summary: message.summary,
  category: message.category,
  originalMessage: message.summary,
  status: 'received', // Set the status to "received" or any other desired value
});

const IncidenceController = {
  async fetchAndCreateIncidences(req, res, next) {
    try {
      const messages = await fetchMessages();
      console.log(" Fetch messages from wherever you are getting them", messages)

      if (messages.length === 0) {
        console.log("No messages to process");
        return [];
      }

      const filteredMessages = messages.filter((message) => message.status === "delivered");
      console.log("Filter messages based on some criteria (e.g., state is previous to received)", filteredMessages)
      const createdIncidences = [];

      for (const message of filteredMessages) {
        const incidenceData = transformMessageToIncidence(message);
        const incidence = await Incidence.create(incidenceData);
        await updateMessageState(message.id, 'received');
        createdIncidences.push(incidence);
      }
      console.log(createdIncidences)
      res.status(201).send({ message: "Manual incidence created successfully", createdIncidences })
    } catch (error) {
      console.error("Error in fetchAndCreateIncidences:", error);
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
      // Associate incidence with building
      if (buildingId) {
        const building = await Building.findById(buildingId);
        if (building) {
          building.incidenceIds.push(incidence._id);
          await building.save();
        }
      }
      // Associate incidence with doors
      if (doorIds && doorIds.length > 0) {
        const doors = await Door.find({ _id: { $in: doorIds } });
        doors.forEach((door) => {
          door.incidenceIds.push(incidence._id);
          door.save();
        });
      }
      // Associate incidence with owners
      if (ownerIds && ownerIds.length > 0) {
        const owners = await Owner.find({ _id: { $in: ownerIds } });
        owners.forEach((owner) => {
          owner.incidenceIds.push(incidence._id);
          owner.save();
        });
      }

      res.status(201).send({ message: "Manual incidence created successfully", incidence });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Unexpected error creating the manual incidence" });
    }
  },
  async getAllIncidences(req, res) {
    try {
      const incidences = await Incidence.find()
        .populate(
          {
            path: "buildingId",
            select: "address number",
            // populate: {
            //   path: "doorIds",
            //   select: "incidenceIds"
            // }
          });
      res.send(incidences);
      if (incidences.length < 1) {
        return res.send({ message: "The're not incidences" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Unexpected error looking for the incidences" });
    }
  },
  async getIncidenceById(req, res) {
    try {
      const incidence = await Incidence.findById(req.params.id);
      if (!incidence) {
        return res.status(404).send({ message: "Incidence not found" });
      }
      res.send(incidence);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Unexpected error looking for the incidence" });
    }
  },
  async updateIncidence(req, res) {
    try {
      const incidence = await Incidence.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!incidence) {
        return res.status(404).send({ message: "Incidence not found" });
      }
      res.send({ message: "Incidence updated successfully", incidence });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Unexpected error updating the incidence" });
    }
  },
  async deleteIncidence(req, res) {
    try {
      const incidence = await Incidence.findByIdAndDelete(req.params.id);
      if (!incidence) {
        return res.status(404).send({ message: "Incidence not found" });
      }
      res.status(200).send({ message: "Incidence deleted successfully", incidence });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Unexpected error deleting the incidence" });
    }
  },
};

module.exports = IncidenceController;
