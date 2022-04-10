import expressLoader from "./express";
import databaseLoader from "./sequelize";
import Logger from "./logger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async ({ expressApp }: any) => {
  Logger.info("🔫 Loading API...");

  await databaseLoader();
  Logger.info("✅ Sequelize DB ORM loaded");

  await expressLoader({ app: expressApp });
  Logger.info("✅ Node Express loaded");
};
