"use strict";
const { Model } = require("sequelize");
const { nanoid } = require("nanoid");
module.exports = (sequelize, DataTypes) => {
  class flightBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // formQuestion.belongsTo(models.eventform);
      // formQuestion.hasMany(models.formOption);
    }
  }
  flightBook.init(
    {
      id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10),
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      question: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      eventformId: {
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
      modelName: "formQuestion",
      timestamps: true,
      paranoid: true,
      tableName: "formQuestions",
    }
  );
  return flightBook;
};
