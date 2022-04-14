export { default as rootRouter } from "./routes/root";
import { Router } from "express";
import rootRouter from "./routes/root";
import usersRouter from "./routes/users";
import swaggerRouter from "./routes/swagger";

// guaranteed to get dependencies
export default () => {
  const app = Router();
  rootRouter(app);
  usersRouter(app);
  swaggerRouter(app);

  return app;
};
