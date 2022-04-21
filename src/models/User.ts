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
  createdAt: any;
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
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 100],
      },
    },
    profilePic: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "User",
    timestamps: true,
  }
);

User.hasMany(Certificate);
Certificate.belongsTo(User);

export default User;
