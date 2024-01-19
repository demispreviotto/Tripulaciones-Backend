require("dotenv").config();
const Building = require("../models/Building");
const Owner = require("../models/Owner");
const Incidence = require("../models/Incidence");

const incidenceStatusOptions = [
  "Recibida",
  "En proceso",
  "Bajo Investigación",
  "Esperando Aprobación",
  "Contactada",
  "Esperando Información",
  "Esperando Acción",
  "Completada",
  "Revisión post resolución"
];

const fs = require("fs");

const loadAndSaveTodos = async () => {
  try {
    const rawData = fs.readFileSync("./data/json_tareas.json");
    const todosData = JSON.parse(rawData);

    // Create and assign todos to buildings
    for (const todoData of todosData) {
      const { title, description, completed, buildingId } = todoData;

      // Create a new todo
      const newTodo = await Todo.create({
        title,
        description,
        completed,
        buildingId,
      });

      if (buildingId) {
        // Find the corresponding building and update todoIds
        const updatedBuilding = await Building.findByIdAndUpdate(
          buildingId,
          { $push: { todoIds: newTodo._id } },
          { new: true }
        );
        console.log('buildign id pushed', updatedBuilding)
      }
    }

    console.log('TODOs uploaded to MongoDB successfully');
  } catch (error) {
    console.error('Error uploading TODOs:', error.message);
  }
};

const AdminController = {
  async createBuildingsFromJson(req, res) {
    try {
      const jsonFincasData = require("./data/json_fincas.json");
      for (const buildingData of jsonFincasData) {
        const { address, zipCode, city, province, cif } = buildingData;
        if (address) {
          const [streetName, streetNumber] = address.split(", ");
          const existingBuilding = await Building.findOne({
            address: streetName,
            number: streetNumber,
          });
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
      res.status(201).send({ message: "Fincas creadas correctamente" });
    } catch (error) {
      res.status(500).send({ message: "Error creando las fincas" });
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
        const building = await Building.findOne({
          address: { $regex: new RegExp(streetName, "i") },
        });
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
          await Building.findByIdAndUpdate(
            building._id,
            { $push: { ownerIds: owner._id } },
            { new: true }
          );
        }
      }
      res.status(201).send({ message: "Propietarios creados correctamente" });
    } catch (error) {
      res.status(500).send({ message: "Error creando los propietarios" });
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
      res
        .status(200)
        .send({ message: "Incidencias mapeadas a fincas exitosamente" });
    } catch (error) {
      res.status(501).send({ message: "Error mapeando las fincas" });
    }
  },


  // Read TODOs from file, map, and save to MongoDB
  async uploadTodos(req, res) {
    try {
      await loadAndSaveTodos();
      res.status(201).json({ message: 'TODOs uploaded to MongoDB successfully' });
    } catch (error) {
      console.error('Error uploading TODOs:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  async updateStatusRandomly(req, res) {
    try {
      // Find all incidences
      const incidences = await Incidence.find();

      // Update each incidence with a random status
      for (const incidence of incidences) {
        const randomStatus =
          incidenceStatusOptions[
          Math.floor(Math.random() * incidenceStatusOptions.length)
          ];

        incidence.status = randomStatus;
        await incidence.save();
      }

      res.status(200).send({ message: "Status updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error updating incidence status" });
    }
  }
};

module.exports = AdminController;
