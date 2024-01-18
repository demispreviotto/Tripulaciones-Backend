require("dotenv").config();
const Building = require("../models/Building");
const Owner = require("../models/Owner");
const Incidence = require("../models/Incidence");

const AdminController = {
    async createBuildingsFromJson(req, res) {
        try {
            const jsonFincasData = require("./data/json_fincas.json");

            for (const buildingData of jsonFincasData) {
                const { address, zipCode, city, province, cif } = buildingData;

                if (address) {
                    const [streetName, streetNumber] = address.split(", ");
                    const existingBuilding = await Building.findOne({ address: streetName, number: streetNumber });

                    if (!existingBuilding) {
                        const building = new Building({
                            address: streetName,
                            zipCode,
                            city,
                            province,
                            number: parseInt(streetNumber),
                            cru: cif,
                            createdBy: [],
                            serviceIds: [],
                            doorIds: [],
                            incidenceIds: [],
                            todoIds: [],
                            ownerIds: [],
                        });

                        await building.save();
                    } else {
                        continue;
                    }
                }
            }

            res.status(201).json({ message: "Buildings created successfully" });
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async createOwnersFromJson(req, res) {
        try {
            const jsonOwnerData = require("./data/json_fincas.json");

            for (const ownerData of jsonOwnerData) {
                const { firstName, phone, address } = ownerData;
                const existingOwner = await Owner.findOne({ phone });

                if (existingOwner) {
                    continue;
                }

                const [streetName, streetNumber] = address.split(", ");
                const building = await Building.findOne({ address: { $regex: new RegExp(streetName, 'i') } });

                if (building) {
                    const [nameParts, lastName, rest] = firstName.split(" ");
                    const owner = new Owner({
                        firstName: nameParts,
                        lastName,
                        phone,
                        email: `${nameParts}${lastName}@fincup.com`,
                        buildingIds: [building._id],
                    });

                    await owner.save();
                    await Building.findByIdAndUpdate(building._id, { $push: { ownerIds: owner._id } }, { new: true });
                }
            }

            res.status(201).json({ message: "Owners created successfully" });
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async mapIncidencesToBuildings(req, res) {
        try {
            const allIncidences = await Incidence.find();

            for (const incidence of allIncidences) {
                const owner = await Owner.findOne({ _id: incidence.ownerIds[0] });

                if (owner && owner.buildingIds) {
                    for (const buildingId of owner.buildingIds) {
                        const building = await Building.findOne({ _id: buildingId });

                        if (building) {
                            building.incidenceIds.push(incidence._id);
                            await building.save();
                        }
                    }
                }
            }

            res.status(200).send({ message: "Incidences mapped to buildings successfully" });
        } catch (error) {
            res.status(501).send("error:", error);
        }
    }
};

module.exports = AdminController;
