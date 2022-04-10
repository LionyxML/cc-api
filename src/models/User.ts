import { Model, DataTypes } from "sequelize";
import config from "../config";

class User extends Model {}

const UserModel = User.init(
  {
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: config.sequelize,
    modelName: "user",
    timestamps: false,
  }
);

export default UserModel;
