const handleValidationErrors = (error, res) => {
  const errors = Object.values(error.errors).map((element) => element.message);
  for (let i = 0; i < errors.length; i++) {
    console.log(errors[i]);
  }
  if (errors.length > 1) {
    const errorMessages = errors.join(" && ");
    res.status(400).send({ message: errorMessages });
  } else {
    res.status(400).send({ message: errors });
  }
};

const handleTypeError = (error, req, res, next) => {
  if (error.name === "ValidationError") {
    handleValidationErrors(error, res);
  } else if (error.code === 11000) {
    res.status(400).send({
      message: "Ya hay una cuenta existente con ese correo",
    });
  } else {
    res.status(500).send({ message: "Hubo un problema" });
  }
  console.error("Unhandled Error:", error);
};

module.exports = { handleTypeError };
