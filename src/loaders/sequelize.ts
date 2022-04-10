import { Sequelize } from "sequelize";
import config from "../config";

const { name, user, password, host } = config.db;

export default () =>
  new Sequelize(name, user, password, {
    dialect: "sqlite",
    host: host,
  });
