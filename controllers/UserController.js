const User = require("../models/User");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

const UserController = {
  async register(req, res) {
    try {
      let hash = "";
      if (req.body.password) {
        hash = bcrypt.hashSync(req.body.password, 10);
      }
      const user = await User.create({
        ...req.body,
        password: hash,
      });
      res.status(201).send({ message: "User created successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected error creating the user");
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
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).send({ message: "Incorrect email or password" });
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(400).send({ message: "Incorrect email or password" });
      }
      const token = jwt.sign({ _id: user._id }, jwt_secret);
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      return res
        .status(200)
        .send({ msg: `Welcome ${user.firstName}`, token, user });
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected error in the login");
    }
  },
  async getAll(req, res) {
    try {
      const users = await User.find();
      res.send(users);
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected error looking for the users");
    }
  },
  async deleteOne(req, res) {
    try {
      await User.deleteOne({
        _id: req.params._id,
      });
      res.send("User deleted successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected error deleting the user");
    }
  },
};

module.exports = UserController;
