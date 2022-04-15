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

  /**
   * @swagger
   * /api/users/login:
   *   post:
   *     summary: Logs in an user
   *     description: Provided with email and password, logs in user returning a JWT key
   *     parameters:
   *         - name: Authorization
   *           in: header
   *           type: string
   *           required: true
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: The user's e-mail.
   *                 example: foo@bar.com
   *               password:
   *                 type: string
   *                 description: The user's password.
   *                 example: myFunnyCat
   *     responses:
   *       200:
   *         description: User profile object.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                       status:
   *                         type: string
   *                         description: the request status: success / error.
   *                         example: success
   *                       token:
   *                         type: string
   *                         description: Your token bearer for JWT.
   *                         example: Bearer eyJhbGciOiJIUzI1N
   *                       user:
   *                         type: object
   *                         properties:
   *                           id:
   *                              type: integer
   *                              description: The user ID.
   *                              example: 1
   *                           firstName:
   *                              type: string
   *                              description: The user's first name.
   *                              example: Foosher
   *                           lastName:
   *                              type: string
   *                              description: The user's last name.
   *                              example: Basher
   *                           email:
   *                              type: string
   *                              description: Uses's e-mail.
   *                              example: foo@bar.com
   *                           password:
   *                              type: string
   *                              description: Hashed Password.
   *                              example: -------
   *       401:
   *         description: Unauthorized.
   */
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

  /**
   * @swagger
   * /api/users/profile:
   *   get:
   *     summary: get logged user profile data
   *     description: Retrieve an object with user profile data.
   *     parameters:
   *         - name: Authorization
   *           in: Authorization
   *           type: string
   *           required: true
   *     responses:
   *       200:
   *         description: User profile object.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                       id:
   *                         type: integer
   *                         description: The user ID.
   *                         example: 1
   *                       firstName:
   *                         type: string
   *                         description: The user's first name.
   *                         example: Foosher
   *                       lastName:
   *                         type: string
   *                         description: The user's last name.
   *                         example: Basher
   *                       email:
   *                         type: string
   *                         description: Uses's e-mail.
   *                         example: foo@bar.com
   *                       password:
   *                         type: string
   *                         description: Hashed Password.
   *                         example: -------
   *       401:
   *         description: Unauthorized.
   */
  app.get(
    "/users/profile",
    passport.authenticate("jwt", {
      session: false,
    }),
    (req, res) => {
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
