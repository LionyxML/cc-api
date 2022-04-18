import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import passport from "passport";
import passportConfigs from "../config/passport";
import routes from "../api/index";
import config from "../config";
import bodyParser from "body-parser";

export default ({ app }: { app: express.Application }) => {
  // Health Check endpoints
  app.get("/status", (_req, res) => {
    res.status(200).end();
  });
  app.head("/status", (_req, res) => {
    res.status(200).end();
  });

  // Limits bodyParser to big files
  app.use(bodyParser.json({ limit: config.maxJSONSize }));
  app.use(bodyParser.urlencoded({ limit: config.maxJSONSize, extended: true }));

  // A bit of hidenness
  app.disable("x-powered-by");

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable("trust proxy");

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Transforms the raw string of req.body into json
  app.use(express.json());
  // Load API routes
  app.use(config.api.prefix, routes());

  // Inits the Passport Middleware
  app.use(passport.initialize());

  // Defines Passport Strategy
  passportConfigs(passport);

  /// catch 404 and forward to error handler
  app.use((_req, _res, next) => {
    const err = new Error("Not Found");
    Object.assign(err, { status: 404 });
    next(err);
  });

  /// error handlers
  const errorHandlerJWT: ErrorRequestHandler = (err, _req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === "UnauthorizedError") {
      return res.status(err.status).send({ message: err.message }).end();
    }
    return next(err);
  };

  app.use(errorHandlerJWT);

  const errorHandlerGeneric: ErrorRequestHandler = (err, _req, res, _next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  };

  app.use(errorHandlerGeneric);
};
