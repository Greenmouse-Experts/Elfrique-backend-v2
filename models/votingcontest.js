"use strict";
const { Model } = require("sequelize");
const { nanoid } = require("nanoid");
module.exports = (sequelize, DataTypes) => {
  class votingContest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      votingContest.belongsTo(models.adminuser);
      votingContest.hasMany(models.contestants);
      votingContest.hasMany(models.contestInfo);
      votingContest.hasMany(models.sponsors);
      votingContest.hasMany(models.contestVote);
    }
  }
  votingContest.init(
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
      identification_name: DataTypes.STRING,
      votelimit: DataTypes.STRING,
      startdate: DataTypes.STRING,
      closedate: DataTypes.STRING,
      timezone: DataTypes.STRING,
      paymentgateway: DataTypes.STRING,
      fee: DataTypes.STRING,
      packagestatus: DataTypes.STRING,
      image: DataTypes.STRING,
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "votingContest",
    }
  );
  return votingContest;
};
