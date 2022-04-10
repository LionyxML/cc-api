import { Router } from "express";
import User from "../../models/User";

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

    if (password !== passwordConfirmation) {
      return res.status(400).json({
        msg: "Passwords do not match",
      });
    }

    User.findOne({ userName: userName }).then((user) => {
      if (user) {
        return res.status(400).json({
          msg: "Username is already taken",
        });
      }
    });

    User.findOne({ email: email }).then((user) => {
      if (user) {
        return res.status(400).json({
          msg: "E-mail already registered. Did you forget your pass?",
        });
      }
    });

    const newUser = new User({
      firstName,
      lastName,
      userName,
      email,
      password,
      passwordConfirmation,
    });

    newUser.save().then(() => {
      return res.status(201).json({
        success: true,
        msg: "User is now registered",
      });
    });
  });

  app.get("/users", async (req, res) => {
    const users = await User.findAll();
    res.send(users);
  });
};
