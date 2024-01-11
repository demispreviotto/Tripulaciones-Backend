const User = require("../models/User");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

const authentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const payload = jwt.verify(token, jwt_secret);
    const user = await User.findOne({ _id: payload._id, tokens: token });
    if (!user) {
      return res.status(401).send({ message: "You're not authorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).send({ message: "The token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).send({ message: "Error with token" });
    } else {
      console.error(error);
      return res
        .status(500)
        .send({ error, message: "Something happened with the token" });
    }
  }
};

const isAdmin = (req, res, next) => {
  const admin = "admin";
  if (req.user.role !== admin) {
    return res.status(403).send({
      message: "You do not have permission",
    });
  }
  next(); // devs
};

module.exports = { authentication, isUser, isAdmin };
