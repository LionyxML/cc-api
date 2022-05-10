import expressLoader from "./express";
import databaseLoader from "./sequelize";
import Logger from "./logger";
import __ from "./i18n";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async ({ expressApp }: any) => {
  Logger.info(`🔫 ${__("loading")}`);

  await databaseLoader();
  Logger.info(`✅ ${__("sequelize.loaded")}`);

  await expressLoader({ app: expressApp });
  Logger.info(`✅ ${__("express.loaded")}`);
};
