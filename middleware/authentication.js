const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const payload = jwt.verify(token, jwt_secret);
    const user = await User.findOne({ _id: payload._id, tokens: token });
    if (!user) {
      return res.status(401).send({ message: "No estás autorizado" });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).send({ message: "El token expiró" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).send({ message: "Error con el token" });
    } else {
      console.error(error);
      return res
        .status(500)
        .send({ error, message: "Algo sucedió con el token" });
    }
  }
};

const isAdmin = (req, res, next) => {
  const admin = "admin";
  if (req.user.role !== admin) {
    return res.status(403).send({
      message: "No tienes permiso",
    });
  }
  next();
};

module.exports = { authentication, isAdmin };
