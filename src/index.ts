import "dotenv/config";
import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.disable("x-powered-by");

// Test route
app.get("/", (_req, res) => {
  return res.send("<h3>API server is running</h3>");
});

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
