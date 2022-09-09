"use strict";
const { Model } = require("sequelize");
const { nanoid } = require("nanoid");

module.exports = (sequelize, DataTypes) => {
  class eventform extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      eventform.belongsTo(models.adminuser);
      eventform.hasMany(models.formQuestion);
      eventform.hasMany(models.formOption);
    }
  }
  eventform.init(
    {
      identification_name: DataTypes.STRING,
      id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10),
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      image: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      startdate: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      closedate: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      timezone: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      fee: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      type: {
        allowNull: false,
        type: DataTypes.ENUM("free", "paid"),
        defaultValue: "free",
      },
      adminuserId: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      paymentgateway: DataTypes.STRING,
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
      modelName: "eventform",
      timestamps: true,
      paranoid: true,
      tableName: "eventforms",
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
    }
  );
  return eventform;
};
