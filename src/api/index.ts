export { default as rootRouter } from "./routes/root";
import { Router } from "express";
import rootRouter from "./routes/root";

// guaranteed to get dependencies
export default () => {
  const app = Router();
  rootRouter(app);

  return app;
};