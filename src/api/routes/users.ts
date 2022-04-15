import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User";
import config from "../../config";
import passport from "passport";

const route = Router();

export default (app: Router) => {
  app.use("/users", route);

  app.post("/users/register", async (req, res) => {
    /*    #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Adding new user.'
          }
        
          #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: { $ref: "#/definitions/User" },
                      examples: { 
                          User: { $ref: "#/components/examples/User" }
                      }
                  }
              }
          }
    } */

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

  app.post("/users/login", (req, res) => {
    User.findOne({ where: { email: req.body.email } }).then((dbUser) => {
      if (!dbUser) {
        return res.status(404).json({
          msg: "Username not found.",
          status: "error",
        });
      }

      bcrypt.compare(req.body.password, dbUser.password).then((isMatch) => {
        if (isMatch) {
          const payload = {
            id: dbUser.id,
            userName: dbUser.userName,
            name: dbUser.firstName,
            email: dbUser.email,
          };
          jwt.sign(
            payload,
            String(config.secretKey),
            { expiresIn: config.jwtExpirationTime },
            (_err, token) => {
              res.status(200).json({
                status: "success",
                user: dbUser,
                token: `Bearer ${token}`,
                msg: "You're now logged in!",
              });
            }
          );
        } else {
          return res.status(404).json({
            msg: "Incorrect password!",
            success: false,
          });
        }
      });
    });
  });

  app.get(
    "/users/profile",
    passport.authenticate("jwt", {
      session: false,
    }),
    (req, res) => {
      /* #swagger.security = [{
               "bearerAuth": []
        }] */
      return res.status(200).json({
        user: req.user,
      });
    }
  );

  app.get("/users", async (_req, res) => {
    const users = await User.findAll();
    res.send(users);
  });
};
