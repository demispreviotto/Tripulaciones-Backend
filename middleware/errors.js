// const handleValidationErrors = (error, response) => {
//   const errors = Object.values(error.errors).map((element) => element.message);
//   if (errors.length > 1) {
//     const errorMessages = errors.join(" || ");
//     response.status(400).send({ messages: errorMessages });
//   } else {
//     response.status(400).send({ message: errors });
//   }
// };

// const handleTypeError = (error, request, response, next) => {
//   if (error.name === "ValidationError") {
//     handleValidationErrors(error, response);
//   } else if (error.code === 11000) {
//     response.status(400).send("The email must be unique");
//   } else {
//     response.status(500).send("Unexpected error");
//   }
// };

// module.exports = { handleTypeError };
const handleValidationErrors = (error, res) => {
  const errors = Object.values(error.errors).map((element) => element.message);

  if (errors.length > 1) {
    const errorMessages = errors.join(" && ");

    res.status(400).send({ message: errorMessages });
  } else {
    res.status(400).send({ message: errors });
  }
  console.error("Validation Error:", error);
};

const handleTypeError = (error, req, res, next) => {
  if (error.name === "ValidationError") {
    handleValidationErrors(error, res);
  } else if (error.code === 11000) {
    res.status(400).send({ message: "Email already in use", error: error.message });
  } else {
    res.status(500).send({ message: "There was a problem", error: error.message });
  }
  console.error("Unhandled Error:", error);
  // res.send({ message: "Unhandled Error", error })
};

module.exports = { handleTypeError };