"use strict";
const { Model } = require("sequelize");
const { nanoid } = require("nanoid");
module.exports = (sequelize, DataTypes) => {
  class trivia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      trivia.belongsTo(models.adminuser);
      trivia.hasMany(models.question, {
        foreignKey: "triviaId",
        as: "questions",
      });
      trivia.hasMany(models.questionOption, {
        foreignKey: "triviaId",
        as: "options",
      });
      trivia.hasMany(models.triviaplayer, {
        foreignKey: "triviaId",
        as: "players",
      });
    }
  }
  trivia.init(
    {
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
      identification_name: {
        allowNull: true,
        type: DataTypes.STRING,
        defaultValue: null,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      instruction: DataTypes.TEXT,
      duration: { type: DataTypes.STRING, allowNull: true },
      type: {
        allowNull: false,
        type: DataTypes.ENUM("free", "paid"),
        defaultValue: "free",
      },
      numberoftimes: {
        allowNull: false,
        type: DataTypes.ENUM("once", "unlimited"),
        defaultValue: "unlimited",
      },
      paymentgateway: DataTypes.STRING,
      amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "trivia",
    }
  );
  return trivia;
};
