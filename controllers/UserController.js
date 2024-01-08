const User = require("../models/User");
require("dotenv").config();

const UserController = {
  async register(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(201).send({ message: "User created successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).send("Unexpected error creating the user");
    }
  },
};

module.exports = UserController;
