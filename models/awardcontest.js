"use strict";
const { Model } = require("sequelize");
const { nanoid } = require("nanoid");
module.exports = (sequelize, DataTypes) => {
  class awardContest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      awardContest.belongsTo(models.adminuser);
      awardContest.hasMany(models.contestInfo);
      awardContest.hasMany(models.sponsors);
      awardContest.hasMany(models.awardCategories);
      awardContest.hasMany(models.awardNominees);
      awardContest.hasMany(models.awardVote);
    }
  }
  awardContest.init(
    {
      id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10),
      },
      title: DataTypes.STRING,
      type: DataTypes.STRING,
      votelimit: DataTypes.STRING,
      startdate: DataTypes.STRING,
      closedate: DataTypes.STRING,
      timezone: DataTypes.STRING,
      paymentgateway: DataTypes.STRING,
      fee: DataTypes.STRING,
      packagestatus: DataTypes.STRING,
      categories: DataTypes.STRING,
      image: DataTypes.STRING,
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "awardContest",
    }
  );
  return awardContest;
};
