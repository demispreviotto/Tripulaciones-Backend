const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3001;
const cors = require("cors");

const { handleTypeError } = require("./middleware/errors");
const { dbConnection } = require("./config/config");
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
app.use("/admin", require("./routes/admin"));

app.use(handleTypeError);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
