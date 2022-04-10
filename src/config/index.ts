import dotenv from "dotenv";
import { Sequelize } from "sequelize";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⛔ Couldn't find .env file");
}

const isDevMode = () => process.env.NODE_ENV === "development";

export default {
  port: process.env.PORT || "8888",
  logs: {
    level: process.env.LOG_LEVEL || "silly",
    folder: "dist/logs",
    infoFile: "info.log",
    errorFile: "error.log",
  },
  api: {
    prefix: "/api",
  },
  mode: process.env.NODE_ENV,
  sequelize: new Sequelize(
    isDevMode() ? "test-db" : process.env.DB_NAME || "",
    isDevMode() ? "admin" : process.env.DB_USER || "",
    isDevMode() ? "123456" : process.env.DB_PASS || "",
    {
      dialect: "sqlite",
      // host: isDevMode() ? ":memory:" : process.env.DB_PATH || "",
      host: isDevMode() ? "./dist/db/db.sqlite" : process.env.DB_PATH || "",
    }
  ),
  isDevMode: isDevMode,
};
