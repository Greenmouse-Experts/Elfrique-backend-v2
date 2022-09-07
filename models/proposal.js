//const Sequelize = require('sequelize');
//const db = require('../database/db');
const {nanoid} = require('nanoid');

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class proposal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      proposal.belongsTo(models.eventjob, {
        foreignKey: "jobId",
      });
      // proposal.belongsTo(models.adminuser, {
      //     foreignKey: "userId"
      // });
      //event.hasMany(models.eventjob)
    }
  }
  proposal.init(
    {
      id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10),
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.STRING,
      },
      img_id: {
        type: DataTypes.STRING,
      },
      img_url: {
        type: DataTypes.STRING,
      },
      firstname: {
        type: DataTypes.STRING,
      },
      surname: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        defaultValue: "none",
      },
      phone: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "proposal",
      timestamps: true,
    }
  );
  return proposal;
};
