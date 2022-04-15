import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for CC",
    version: "1.0.0",
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/api/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default (app: Router) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
