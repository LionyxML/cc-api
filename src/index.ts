import "dotenv/config";
import express from "express";
import cors from "cors";
import { rootRouter } from "./api";

const PORT = process.env.PORT || 5050;
const app = express();

app.disable("x-powered-by");
app.use(cors());
app.use("/", rootRouter);

app.listen(PORT, () => {
  const welcomeArt = `
  ____ ____              _    ____ ___
 / ___/ ___|            / \\  |  _ \\_ _|
| |  | |      _____    / _ \\ | |_) | |
| |__| |___  |_____|  / ___ \\|  __/| |
 \\____\\____|         /_/   \\_\\_|  |___|
  `;
  console.log(welcomeArt);
  console.log(`CC API server started on port: ${PORT}`);
});
