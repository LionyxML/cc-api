import "dotenv/config";
import express from "express";
import config from "./config";
import LoggerInstance from "./loaders/logger";

const startServer = async () => {
  const app = express();

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  await require("./loaders").default({ expressApp: app });

  app
    .listen(config.port, () => {
      console.info(`
#####################################################
         ____ ____              _    ____ ___
        / ___/ ___|            / \\  |  _ \\_ _|
       | |  | |      _____    / _ \\ | |_) | |
       | |__| |___  |_____|  / ___ \\|  __/| |
        \\____\\____|         /_/   \\_\\_|  |___|

      🟢  Server listening on port:  ${config.port}
      🟢  Server is running in mode: ${config.mode}
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
