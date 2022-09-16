"use strict";
const { Model } = require("sequelize");
const {nanoid} = require("nanoid");
module.exports = (sequelize, DataTypes) => {
  class awardNominees extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      awardNominees.belongsTo(models.awardContest);
      awardNominees.belongsTo(models.awardCategories, {
        foreignKey: "awardCategoriesId",
        as: "Categories",
      });
      awardNominees.hasMany(models.awardVote);
    }
  }
  awardNominees.init(
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
      voteCount: DataTypes.INTEGER,
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "awardNominees",
    }
  );
  return awardNominees;
};
