import "dotenv/config";
import express from "express";
import config from "./config";
import appLoader from "./loaders";
import LoggerInstance from "./loaders/logger";

const startServer = async () => {
  const app = express();

  await appLoader({ expressApp: app });

  app
    .listen(config.port, () => {
      console.info(`
#####################################################
         ____ ____              _    ____ ___
        / ___/ ___|            / \\  |  _ \\_ _|
       | |  | |      _____    / _ \\ | |_) | |
       | |__| |___  |_____|  / ___ \\|  __/| |
        \\____\\____|         /_/   \\_\\_|  |___|

        🟢  Server port: ${config.port}
        🟢  Server mode: ${config.mode} ${config.isDevMode() ? "🧪" : "🚀"}
#####################################################
    `);
    })
    .on("error", (err) => {
      LoggerInstance.error(err);
      LoggerInstance.error("⛔ Stopping API process...");
      process.exit(1);
    });
};

startServer();
