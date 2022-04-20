/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, DataTypes } from "sequelize";
import { sequelize } from "../loaders/sequelize";

class Certificate extends Model {
  id: any;
  certificate: any;
}

Certificate.init(
  {
    certificate: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "Certificate",
    timestamps: false,
  }
);

export default Certificate;
