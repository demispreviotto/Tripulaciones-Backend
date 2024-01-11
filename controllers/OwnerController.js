const Owner = require("../models/Owner");
require("dotenv").config();

const OwnerController = {
  async create(req, res, next) {
    try {
      const owner = await Owner.create(req.body);
      console.log("hola")
      res.status(201).send({ message: "Owner created successfully", owner });
    } catch (error) {
      next(error);
    }
  },
  async getAll(req, res) {
    try {
      const owners = await Owner.find();
      res.send(owners);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Unexpected error looking for the owners" });
    }
  },
  async delete(req, res) {
    try {
      await Owner.findByIdAndDelete(req.params._id);
      res.send({ message: "Owner deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Unexpected error deleting the owner" });
    }
  },
  async update(req, res) {
    try {
      const owner = await Owner.findByIdAndUpdate(req.params._id, req.body, {
        new: true,
      });
      res.send({ message: "Owner updated successfully", owner });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Unexpected error updating the owner" });
    }
  },
};

module.exports = OwnerController;
