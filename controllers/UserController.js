const User = require("../models/User");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

const UserController = {
  async register(req, res, next) {
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
      const user = await User.findOne({ email: req.body.email })
        .populate(
          {
            path: "buildingIds",
            select: "address number",
            populate: {
              path: "doorIds",
              select: "incidenceIds"
            }
          })
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
        .send({ message: `Welcome ${user.firstName}`, token, user });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Unexpected error in the login" });
    }
  },
  async getAll(req, res) {
    try {
      const users = await User.find();
      res.send(users);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Unexpected error looking for the users" });
    }
  },
  async deleteOne(req, res) {
    try {
      await User.findByIdAndDelete(req.user._id);
      res.send({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Unexpected error deleting the user" });
    }
  },
  async logout(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: { tokens: req.headers.authorization },
      });
      res.send({ message: `See you soon ${user.firstName}` });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Unexpected error in the logout" });
    }
  },
  async getLoggedUser(req, res) {
    try {
      const user = await User.findById({ _id: req.user._id });
      // .populate()
      res.status(200).send(user);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "Error while trying to get the current user" });
    }
  },
  async update(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
      });
      res.send({ message: "User updated successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Unexpected error updating the user" });
    }
  },
};

module.exports = UserController;
