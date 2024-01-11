require("dotenv").config();
const Building = require('../models/Building');

const BuildingController = {
    async createBuilding(req, res) {
        try {
            const building = new Building(req.body);
            await building.save();
            res.status(201).json(building);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async getAllBuildings(req, res) {
        try {
            const buildings = await Building.find();
            res.json(buildings);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async getBuildingById(req, res) {
        try {
            const building = await Building.findById(req.params.id);
            if (!building) {
                return res.status(404).json({ error: 'Building not found' });
            }
            res.json(building);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async updateBuildingById(req, res) {
        try {
            const building = await Building.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!building) {
                return res.status(404).json({ error: 'Building not found' });
            }
            res.json(building);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async deleteBuildingById(req, res) {
        try {
            const building = await Building.findByIdAndDelete(req.params.id);
            if (!building) {
                return res.status(404).json({ error: 'Building not found' });
            }
            res.json(building);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
module.exports = BuildingController;
