import "dotenv/config";
import express from "express";
import config from "./config";
import appLoader from "./loaders";
import LoggerInstance from "./loaders/logger";
import __ from "./loaders/i18n";

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

        🟢  ${__("server.port")} ${config.port}
        🟢  ${__("server.mode")} ${config.mode} ${
        config.isDevMode() ? "🧪" : "🚀"
      }
#####################################################
    `);
    })
    .on("error", (err) => {
      LoggerInstance.error(err);
      LoggerInstance.error(`⛔ ${__("stopping.api")}`);
      process.exit(1);
    });
};

startServer();
