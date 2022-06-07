"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transaction.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
      },
      admin_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      payer_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      category: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      reference: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      amount: {
        allowNull: false,
        type: DataTypes.FLOAT, // decimal(10,2)
      },
      method: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      phone_no: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      type: {
        allowNull: true,
        type: DataTypes.ENUM("free", "paid"),
        defaultValue: "paid",
      },
      product_title: {
        allowNull: true,
        type: DataTypes.STRING,
      },

      product_id: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "transaction",
      timestamps: true,
      paranoid: true,
      tableName: "transactions",
    }
  );
  return transaction;
};
