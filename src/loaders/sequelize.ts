import config from "../config";
import UserModel from "../models/User";

const sequelize = config.sequelize;

export default () => {
  sequelize.sync({ force: true });
  UserModel;
};
