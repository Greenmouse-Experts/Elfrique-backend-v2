"use strict";
const { Model } = require("sequelize");
const {nanoid} = require("nanoid");
module.exports = (sequelize, DataTypes) => {
  class awardCategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      awardCategories.belongsTo(models.awardContest);
      awardCategories.hasMany(models.awardNominees, {
        foreignKey: "awardCategoriesId",
        as: "nominees",
      });
    }
  }
  awardCategories.init(
    {
      id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10),
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "awardCategories",
    }
  );
  return awardCategories;
};
