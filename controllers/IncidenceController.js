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
      console.error(error);
      res
        .status(500)
        .send({ message: "Unexpected error creating the incidence" });
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
            path: "buildingIds",
            select: "address, number",
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
