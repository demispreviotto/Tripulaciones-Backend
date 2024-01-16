const User = require("../models/User");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

const UserController = {
  async register(req, res, next) {
    try {
      let hash = "";
      if (req.body.password) {
        hash = bcrypt.hashSync(req.body.password, 10);
      }
      const user = await User.create({
        ...req.body,
        password: hash,
      });
      res.status(201).send({ message: "Usuario creado exitosamente", user });
    } catch (error) {
      next(error);
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .send({ message: "Por favor inserte el correo y la contraseña" });
      }
      const user = await User.findOne({ email: req.body.email }).populate({
        path: "buildingIds",
        select: "address number",
        populate: {
          path: "doorIds",
          select: "incidenceIds",
        },
      });
      if (!user) {
        return res
          .status(400)
          .send({ message: "Contraseña y/o correo incorrectos" });
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .send({ message: "Contraseña y/o correo incorrectos" });
      }
      const token = jwt.sign({ _id: user._id }, jwt_secret);
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      return res
        .status(200)
        .send({ message: `Bienvenid@, ${user.firstName}`, token, user });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error al inciar sesión" });
    }
  },
  async getAll(req, res) {
    try {
      const users = await User.find();
      res.send(users);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error en la búsqueda de los usuarios" });
    }
  },
  async deleteOne(req, res) {
    try {
      await User.findByIdAndDelete(req.user._id);
      res.send({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error al eliminar al usuario" });
    }
  },
  async logout(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: { tokens: req.headers.authorization },
      });
      res.send({ message: `Vuelve pronto, ${user.firstName}` });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error al cerrar sesión" });
    }
  },
  async getLoggedUser(req, res) {
    try {
      const user = await User.findById({ _id: req.user._id });
      // .populate()
      res.status(200).send(user);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Error en la búsqueda del usuario" });
    }
  },
  async update(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
      });
      res.send({ message: "Usuario modificado exitosamente", user });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error al modificar al usuario" });
    }
  },
};

module.exports = UserController;
