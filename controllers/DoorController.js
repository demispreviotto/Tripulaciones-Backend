const Door = require('../models/Door');

const DoorController = {
    async createDoor(req, res) {
        try {
            const door = new Door(req.body);
            await door.save();
            res.status(201).json(door);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async getAllDoors(req, res) {
        try {
            const doors = await Door.find();
            res.json(doors);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async getDoorById(req, res) {
        try {
            const door = await Door.findById(req.params.id);
            if (!door) {
                return res.status(404).json({ error: 'Door not found' });
            }
            res.json(door);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async updateDoorById(req, res) {
        try {
            const door = await Door.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!door) {
                return res.status(404).json({ error: 'Door not found' });
            }
            res.json(door);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async deleteDoorById(req, res) {
        try {
            const door = await Door.findByIdAndDelete(req.params.id);
            if (!door) {
                return res.status(404).json({ error: 'Door not found' });
            }
            res.json(door);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
module.exports = DoorController;