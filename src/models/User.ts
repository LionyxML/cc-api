/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../loaders/sequelize";
import Certificate from "./Certificate";

class User extends Model {
  firstName: any;
  lastName: any;
  userName: any;
  password: any;
  profilePic: any;
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
    profilePic: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "User",
    timestamps: false,
  }
);

User.hasMany(Certificate);
Certificate.belongsTo(User);

export default User;
