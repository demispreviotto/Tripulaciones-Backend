const axios = require("axios");
const Incidence = require("../models/Incidence");
require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log("mongoDB connected"))
  .catch((err) => console.error(err));

axios.get(process.env.DATA_URI).then(async (res) => {
  console.log(res.data);
  // guardar la hora del fetch y compararlo para traer los ultimos
  // programar para hacerse automaticamente
  const incidences = res.data.incidences;
  for (const incidence of incidences) {
    Incidence.create({
      summary: incidence.mensaje,
      category: incidence.categoria,
      originalMessage: incidence.mensaje,
      status: incidence.estado,
      ownerIds: incidence.owner,
    });
  }
});
