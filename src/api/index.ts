export { default as rootRouter } from "./routes/root";
import { Router } from "express";
import rootRouter from "./routes/root";
import usersRouter from "./routes/users";
import swaggerRouter from "./routes/swagger";
import certificatesRouter from "./routes/certificates";

// guaranteed to get dependencies
export default () => {
  const app = Router();
  rootRouter(app);
  usersRouter(app);
  swaggerRouter(app);
  certificatesRouter(app);

  return app;
};
