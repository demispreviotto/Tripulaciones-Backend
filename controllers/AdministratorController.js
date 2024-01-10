const Administrator = require("../models/Administrator");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

const AdministratorController = {
  async register(req, res) {
    try {
      let hash = "";
      if (req.body.password) {
        hash = bcrypt.hashSync(req.body.password, 10);
      }
      const administrator = await Administrator.create({
        ...req.body,
        password: hash,
      });
      res
        .status(201)
        .send({ message: "Administrator created successfully", administrator });
    } catch (error) {
      next(error);
    }
  },
  async getAll(req, res) {
    try {
      const administrators = await Administrator.find();
      res.send(administrators);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Unexpected error looking for the administrators" });
    }
  },
};

module.exports = AdministratorController;
