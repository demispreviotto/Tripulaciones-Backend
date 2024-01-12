require("dotenv").config();
const Building = require("../models/Building");

const BuildingController = {
  async createBuilding(req, res, next) {
    try {
      const userId = req.user.id;
      const building = new Building({
        ...req.body,
        createdBy: userId
      });
      await building.save();
      res
        .status(201)
        .send({ message: "Building created successfully", building });
    } catch (error) {
      next(error);
    }
  },
  async getAllBuildings(req, res) {
    try {
      const buildings = await Building.find();
      res.send(buildings);
    } catch (error) {
      res
        .status(500)
        .send({ message: "Unexpected error looking for the buildings" });
    }
  },
  async getBuildingById(req, res) {
    try {
      const building = await Building.findById(req.params.id);
      if (!building) {
        return res.status(404).send({ message: "Building not found" });
      }
      res.send(building);
    } catch (error) {
      res
        .status(500)
        .send({ message: "Unexpected error looking for the building" });
    }
  },
  async updateBuildingById(req, res) {
    try {
      const building = await Building.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!building) {
        return res.status(404).send({ message: "Building not found" });
      }
      res.send({ message: "Building updated successfully", building });
    } catch (error) {
      res
        .status(400)
        .send({ message: "Unexpected error updating the builing" });
    }
  },
  async deleteBuildingById(req, res) {
    try {
      const building = await Building.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .send({ message: "Building deleted successfully", building });
      if (!building) {
        return res.status(404).send({ message: "Building not found" });
      }
      res.send(building);
    } catch (error) {
      res
        .status(500)
        .send({ message: "Unexpected error deleting the building" });
    }
  },
};
module.exports = BuildingController;
