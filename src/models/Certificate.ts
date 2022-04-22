/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from "sequelize";
import config from "../config";
import { sequelize } from "../loaders/sequelize";

class Certificate extends Model {
  id: any;
  certificate: any;
  createdAt: any;
}

Certificate.init(
  {
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [Number(config.minFileNameSize), Number(config.maxFileNameSize)],
      },
    },
    certificate: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "Certificate",
    timestamps: true,
  }
);

export default Certificate;
