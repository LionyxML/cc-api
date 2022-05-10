import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User";
import config from "../../config";
import passport from "passport";
import LoggerInstance from "../../loaders/logger";
import __ from "../../loaders/i18n";

const route = Router();

export default (app: Router) => {
  app.use("/users", route);

  app.post("/users/register", async (req, res) => {
    /*    
          #swagger.tags = ['Users']
          #swagger.summary = "Register a user to the system"
          #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Adding new user.'
          }
    } */

    const {
      firstName,
      lastName,
      userName,
      email,
      password,
      passwordConfirmation,
      profilePic,
    } = req.body;

    console.log("recebido:", req.body);

    try {
      if (Object.keys(req.body).length < 6) {
        return res.status(400).json({
          status: "error",
          msg: `${__("user.allfields")}`,
        });
      }

      const sentProfilePicSize = Buffer.from(
        profilePic.split(",")[1],
        "base64"
      );

      if (sentProfilePicSize.length > config.maxProfileSize) {
        return res.status(400).json({
          status: "error",
          msg: `${__("profilepic.should.not.1")} ${
            config.maxProfileSize
          } __("profilepic.should.not.2")} ${
            sentProfilePicSize.length
          } __("profilepic.should.not.3")}`,
        });
      }

      if (password !== passwordConfirmation) {
        return res.status(400).json({
          status: "error",
          msg: `${__("user.passwords.do.not.match")}`,
        });
      }

      if (await User.findOne({ where: { userName: userName } }))
        return res.status(400).json({
          status: "error",
          msg: `${__("user.taken")}`,
        });

      if (await User.findOne({ where: { email: email } }))
        return res.status(400).json({
          status: "error",
          msg: `${__("user.email.taken")}`,
        });

      const newUser = new User({
        firstName,
        lastName,
        userName,
        email,
        password,
        profilePic,
      });

      // TODO: is it needed here or can it be "global" ?
      const salt = await bcrypt.genSalt(Number(config.salt));
      const hash = await bcrypt.hash(newUser.password, salt);
      newUser.password = hash;

      await newUser
        .save()
        .then(() => {
          return res.status(201).json({
            status: "success",
            msg: `${__("user.registered")}`,
          });
        })
        .catch(
          /* istanbul ignore next */ (err) => {
            return res.status(500).json({
              status: "error",
              msg: err.message,
            });
          }
        );
    } catch (error) {
      LoggerInstance.error("Error:", error);
      return res.status(500).json({
        msg: `${__("unknown.error")}`,
        status: "error",
      });
    }
  });

  app.post("/users/login", (req, res) => {
    /*    
          #swagger.tags = ['Users']
          #swagger.summary = "Logs in a registered user"
          #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Adding new user.'
          }
    } */

    User.findOne({ where: { email: req.body.email } }).then((dbUser) => {
      if (!dbUser) {
        return res.status(404).json({
          msg: `${__("user.not.found")}`,
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
                msg: `${__("user.loggedin")}`,
              });
            }
          );
        } else {
          return res.status(404).json({
            msg: `${__("user.incorrect.password")}`,
            status: "error",
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
      /*
          #swagger.tags = ['Users']
          #swagger.summary = "Get loged users profile"
          #swagger.parameters['Authorization'] = {
            in: 'header',
            description: 'A JWT bearer',
            required: true,
          }
          #swagger.responses[200] = {
            description: 'User successfully obtained.',
          }
      */

      return res.status(200).json({
        user: req.user,
      });
    }
  );

  // app.get("/users", async (_req, res) => {
  //   /*  // TODO: debug only, this should not be here
  //       #swagger.tags = ['Users']
  //       #swagger.summary = "Lists all users in database"
  //       #swagger.responses[200] = {
  //         description: 'Users successfully obtained.',
  //   */

  //   const users = await User.findAll();
  //   res.send(users);
  // });
};
