const Incidence = require("../models/Incidence");
require("dotenv").config();

const IncidenceController = {
  async create(req, res) {
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
  async getAll(req, res) {
    try {
      const incidences = Incidence.find();
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
};

module.exports = IncidenceController;
