const Incidence = require("../models/Incidence");
require("dotenv").config();

const IncidenceController = {
  async createIncidence(req, res) {
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
  async getAllIncidences(req, res) {
    try {
      const incidences = await Incidence.find();
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
