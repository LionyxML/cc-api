/* istanbul ignore file */
import config from "../config";
import Logger from "./logger";
import { Sequelize } from "sequelize";

const { dbName, user, pass, host } = config.sequelize;

export const sequelize = new Sequelize(dbName, user, pass, {
  dialect: "sqlite",
  host: host,
  logging: (msg) => Logger.info(`📝 ${msg}`),
});

export default async () => {
  if (config.isDevMode() || config.isTestMode()) {
    await sequelize.sync({ force: true });
  } else {
    await sequelize.sync();
  }
};
