import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import * as swaggerFile from "../../swagger/swagger_output.json";

export default (app: Router) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
};
