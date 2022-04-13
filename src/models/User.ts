/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../loaders/sequelize";

class User extends Model {
  firstName: any;
  lastName: any;
  userName: any;
  password: any;
  email: any;
  id: any;
}

User.init(
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "User",
    timestamps: false,
  }
);

export default User;
