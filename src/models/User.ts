import { Model, DataTypes } from "sequelize";
import { sequelize } from "../loaders/sequelize";

class User extends Model {}

User.init(
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
    sequelize: sequelize,
    modelName: "User",
    timestamps: false,
  }
);

export default User;
