"use strict";
const { Model } = require("sequelize");
const { nanoid } = require("nanoid");
module.exports = (sequelize, DataTypes) => {
  class payout extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      payout.belongsTo(models.adminuser, {
        foreignKey: "userId",
      });
    }
  }
  payout.init(
    {
      id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10),
      },
      service_type: {
        type: DataTypes.STRING,
      },
      product_name: {
        type: DataTypes.STRING,
      },
      approval_status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        defaultValue: "pending",
      },
      paayment_status: {
        type: DataTypes.ENUM("pending", "paid", "rejected"),
        defaultValue: "pending",
      },
      amount: {
        type: DataTypes.INTEGER,
      },
    },

    {
      sequelize,
      modelName: "payout",
    }
  );
  return payout;
};
