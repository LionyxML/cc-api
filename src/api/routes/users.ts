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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (await User.findOne({ userName: userName } as any))
      return res.status(400).json({
        status: "error",
        msg: "Username is already taken.",
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (await User.findOne({ email: email } as any))
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
      passwordConfirmation,
    });

    if (await newUser.save()) {
      return res.status(201).json({
        status: "success",
        msg: "User is now registered.",
      });
    }
  });

  app.get("/users", async (req, res) => {
    const users = await User.findAll();
    res.send(users);
  });
};
