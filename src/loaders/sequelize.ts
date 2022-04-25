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
  // await sequelize.sync();
  if (config.isDevMode()) await sequelize.sync({ force: true });
};
