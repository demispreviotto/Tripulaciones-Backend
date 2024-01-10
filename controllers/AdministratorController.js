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
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .send({ message: "Please enter email and password" });
      }
      const administrator = await Administrator.findOne({
        email: req.body.email,
      });
      if (!administrator) {
        return res.status(400).send({ message: "Incorrect email or password" });
      }
      const isMatch = await bcrypt.compare(
        req.body.password,
        administrator.password
      );
      if (!isMatch) {
        return res.status(400).send({ message: "Incorrect email or password" });
      }
      const token = jwt.sign({ _id: administrator._id }, jwt_secret);
      if (administrator.tokens.length > 4) administrator.tokens.shift();
      administrator.tokens.push(token);
      await administrator.save();
      return res.status(200).send({
        message: `Welcome ${administrator.firstName}`,
        token,
        administrator,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Unexpected error in the login" });
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
  async logout(req, res) {
    try {
      const administrator = await Administrator.findByIdAndUpdate(
        req.administrator._id,
        {
          $pull: { tokens: req.headers.authorization },
        }
      );
      res.send({ message: `See you soon ${administrator.firstName}` });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Unexpected error in the logout" });
    }
  },
};

module.exports = AdministratorController;
