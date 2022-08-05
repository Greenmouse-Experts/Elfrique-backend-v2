"use strict";
const { Model } = require("sequelize");
const { nanoid } = require("nanoid");
module.exports = (sequelize, DataTypes) => {
  class evisa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  evisa.init(
    {
      id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10),
      },
      fullname: {
        type: DataTypes.TEXT,
      },
      dapart_date: {
        type: DataTypes.DATE,
      },
      return_date: {
        type: DataTypes.DATE,
      },
      visa_type: {
        type: DataTypes.STRING,
      },
      numberOfTravelers: {
        type: DataTypes.INTEGER,
      },
      email: {
        type: DataTypes.STRING,
      },
      phone_number: {
        type: DataTypes.TEXT,
      },
      additional_info: {
        type: DataTypes.TEXT,
      },
      destination: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      approval_status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "evisa",
    }
  );
  return evisa;
};
