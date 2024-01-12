const Door = require("../models/Door");

const DoorController = {
  async createDoor(req, res) {
    try {
      const door = new Door(req.body);
      await door.save();
      res.status(201).send({ message: "Door created successfully", door });
    } catch (error) {
      res.status(400).send({ message: "Unexpected error creating the door" });
    }
  },
  async getAllDoors(req, res) {
    try {
      const doors = await Door.find();
      res.send(doors);
    } catch (error) {
      res
        .status(500)
        .send({ message: "Unexpected error looking for the doors" });
    }
  },
  async getDoorById(req, res) {
    try {
      const door = await Door.findById(req.params.id);
      if (!door) {
        return res.status(404).send({ message: "Door not found" });
      }
      res.send(door);
    } catch (error) {
      res
        .status(500)
        .send({ message: "Unexpected error looking for the door" });
    }
  },
  async updateDoorById(req, res) {
    try {
      const door = await Door.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!door) {
        return res.status(404).send({ message: "Door not found" });
      }
      res.send({ message: "Door updated successfully", door });
    } catch (error) {
      res.status(400).send({ message: "Unexpected error updating the door" });
    }
  },
  async deleteDoorById(req, res) {
    try {
      const door = await Door.findByIdAndDelete(req.params.id);
      if (!door) {
        return res.status(404).send({ message: "Door not found" });
      }
      res.send({ message: "Door deleted successfully", door });
    } catch (error) {
      res.status(500).send({ message: "Unexpected error deleting the door" });
    }
  },
};
module.exports = DoorController;
