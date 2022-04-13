import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../../models/User";
import config from "../../config";

const route = Router();

export default (app: Router) => {
  app.use("/users", route);

  app.post("/users/register", async (req, res) => {
    const {
      firstName,
      lastName,
      userName,
      email,
      password,
      passwordConfirmation,
    } = req.body;

    if (Object.keys(req.body).length < 6) {
      return res.status(400).json({
        status: "error",
        msg: "All fields must be filled in.",
      });
    }

    if (password !== passwordConfirmation) {
      return res.status(400).json({
        status: "error",
        msg: "Passwords do not match.",
      });
    }

    if (await User.findOne({ where: { userName: userName } }))
      return res.status(400).json({
        status: "error",
        msg: "Username is already taken.",
      });

    if (await User.findOne({ where: { email: email } }))
      return res.status(400).json({
        status: "error",
        msg: "E-mail already registered. Did you forget your pass?",
      });

    const newUser = new User({
      firstName,
      lastName,
      userName,
      email,
      password,
    });

    // TODO: is it needed here or can it be "global" ?
    const salt = await bcrypt.genSalt(Number(config.salt));
    const hash = await bcrypt.hash(newUser.password, salt);
    newUser.password = hash;

    if (await newUser.save()) {
      return res.status(201).json({
        status: "success",
        msg: "User is now registered.",
      });
    }
  });

  app.get("/users", async (_req, res) => {
    const users = await User.findAll();
    res.send(users);
  });
};
