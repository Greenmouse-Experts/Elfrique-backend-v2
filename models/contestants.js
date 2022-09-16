"use strict";
const { Model } = require("sequelize");
const {nanoid} = require("nanoid");
module.exports = (sequelize, DataTypes) => {
  class contestants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      contestants.belongsTo(models.votingContest);
      contestants.hasMany(models.contestVote);
    }
  }
  contestants.init(
    {
      id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10),
      },
      fullname: DataTypes.STRING,
      image: DataTypes.STRING,
      contestantnumber: DataTypes.STRING,
      about: DataTypes.TEXT,
      voteCount: {
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
      modelName: "contestants",
    }
  );
  return contestants;
};
