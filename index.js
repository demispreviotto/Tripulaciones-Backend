const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3001;
const cors = require("cors");

//-------------------
const Building = require("./models/Building");
const Owner = require("./models/Owner");
const jsonFincasData = require("./data/json_fincas.json");

const { handleTypeError } = require("./middleware/errors");
const { dbConnection } = require("./config/config");
const Incidence = require("./models/Incidence");
dbConnection();

app.use(express.json());
app.use(cors());

app.use("/users", require("./routes/users"));
app.use("/incidences", require("./routes/incidences"));
app.use("/owners", require("./routes/owners"));
app.use("/buildings", require("./routes/buildings"));
app.use("/doors", require("./routes/doors"));
app.use("/services", require("./routes/services"));
app.use("/todos", require("./routes/todos"));
//-----------------------
app.post("/createBuildingsFromJson", async (req, res) => {
    try {
        const jsonFincasData = require("./data/json_fincas.json");

        // Iterate over each object in the JSON array
        for (const buildingData of jsonFincasData) {
            // Extract relevant information from the JSON data
            const {
                address,
                zipCode,
                city,
                province,
                cif,
                // numero_propietarios,
            } = buildingData;

            // Check if address is defined before attempting to split
            if (address) {
                // Split the address into streetName and number
                const [streetName, streetNumber] = address.split(", ");

                // Check if a building with the same name already exists
                const existingBuilding = await Building.findOne({ address: streetName, number: streetNumber });

                if (!existingBuilding) {
                    // Create a new building
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

                    // Save the new building to the database
                    await building.save();

                    console.log("Building created successfully:", building);
                } else {
                    console.log("Building already exists, skipping:", existingBuilding);
                    // Skip processing the rest of the JSON data if a building already exists
                    continue;
                }
            } else {
                console.error("Error: 'address' property is undefined or missing in JSON data");
            }
        }

        // Respond with success message
        res.status(201).json({ message: "Buildings created successfully" });
    } catch (error) {
        console.error("Error creating buildings:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/createOwnersFromJson", async (req, res) => {
    try {
        const jsonOwnerData = require("./data/json_fincas.json");

        // Iterate over each object in the JSON array
        for (const ownerData of jsonOwnerData) {
            // Extract relevant information from the JSON data
            const {
                firstName,
                phone,
                address,
            } = ownerData;

            // Check if owner with the given phone number already exists
            const existingOwner = await Owner.findOne({ phone });

            if (existingOwner) {
                console.log("Owner already exists for phone:", phone);
                continue; // Skip to the next iteration
            }

            // Split the address into streetName and number
            const [streetName, streetNumber] = address.split(", ");

            // Find the building ID based on streetName
            const building = await Building.findOne({ address: { $regex: new RegExp(streetName, 'i') } });

            if (building) {
                // Extract lastName from the firstName field
                const [nameParts, lastName, rest] = firstName.split(" ");
                // const lastName = nameParts.pop(); // Remove the last name from nameParts
                // const firstNameWithoutLastName = nameParts.join(" ");

                // Create a new owner
                const owner = new Owner({
                    firstName: nameParts,
                    lastName,
                    phone,
                    email: `${nameParts}${lastName}@fincup.com`,
                    buildingIds: [building._id],
                });

                // Save the new owner to the database
                await owner.save();

                // Update the building with the new owner's ID
                await Building.findByIdAndUpdate(building._id, { $push: { ownerIds: owner._id } }, { new: true });

                console.log("Owner created successfully:", owner);
            } else {
                console.log("Building not found for address:", address);
            }
        }

        // Respond with success message
        res.status(201).json({ message: "Owners created successfully" });
    } catch (error) {
        console.error("Error creating owners:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.post("/mapIncidencesToBuildings", async (req, res) => {
    try {
        // Fetch all incidences from MongoDB
        const allIncidences = await Incidence.find();

        // Iterate through each incidence
        for (const incidence of allIncidences) {
            // Find the owner based on ownerIds
            const owner = await Owner.findOne({ _id: incidence.ownerIds[0] });

            if (owner && owner.buildingIds) {
                // Iterate through each building ID in owner's buildingIds
                for (const buildingId of owner.buildingIds) {
                    // Find the building based on buildingId
                    const building = await Building.findOne({ _id: buildingId });

                    if (building) {
                        // Push the incidence ID into incidenceIds
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
})

app.use(handleTypeError);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
