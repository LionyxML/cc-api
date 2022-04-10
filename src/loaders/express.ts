import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import routes from "../api/index";
import config from "../config";

export default ({ app }: { app: express.Application }) => {
  // Health Check endpoints
  app.get("/status", (_req, res) => {
    res.status(200).end();
  });
  app.head("/status", (_req, res) => {
    res.status(200).end();
  });

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
