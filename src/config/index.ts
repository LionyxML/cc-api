import dotenv from "dotenv";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error && process.env.NODE_ENV !== "test") {
  // This error should crash whole process
  throw new Error("⛔ Couldn't find .env file");
}

const isDevMode = () => process.env.NODE_ENV === "development";
const isTestMode = () => process.env.NODE_ENV === "test";

export default {
  port: process.env.PORT || "8888",
  maxJSONSize: "50mb",
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
  sequelize: {
    dbName: isDevMode() ? "test-db" : process.env.DB_NAME || "",
    user: isDevMode() ? "admin" : process.env.DB_USER || "",
    pass: isDevMode() ? "123456" : process.env.DB_PASS || "",
    host: isDevMode() ? "./dist/db/db.sqlite" : process.env.DB_PATH || "",
  },
  isDevMode: isDevMode,
  isTestMode: isTestMode,
  salt: process.env.SALT || "10",
  secretKey: process.env.SECRET_KEY, // No fallbacks here
  jwtExpirationTime: process.env.JWT_EXP_TIMER || 6004800,
  maxProfileSize: process.env.MAX_PROFILE_PIC_SIZE || 2 * 1000 * 1024,
  maxCertificateSize: process.env.MAX_CERTIFICATE_SIZE || 1 * 1000 * 1024,
  minFileNameSize: process.env.MIN_FILE_NAME_SIZE || 3,
  maxFileNameSize: process.env.MAX_FILE_NAME_SIZE || 100,
};
