const Service = require('../models/Service');

const ServiceController = {
    async createService(req, res) {
        try {
            const service = new Service(req.body);
            await service.save();
            res.status(201).json(service);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async getAllServices(req, res) {
        try {
            const services = await Service.find();
            res.json(services);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async getServiceById(req, res) {
        try {
            const service = await Service.findById(req.params.id);
            if (!service) {
                return res.status(404).json({ error: 'Service not found' });
            }
            res.json(service);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    async updateServiceById(req, res) {
        try {
            const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!service) {
                return res.status(404).json({ error: 'Service not found' });
            }
            res.json(service);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    async deleteServiceById(req, res) {
        try {
            const service = await Service.findByIdAndDelete(req.params.id);
            if (!service) {
                return res.status(404).json({ error: 'Service not found' });
            }
            res.json(service);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
module.exports = ServiceController;
