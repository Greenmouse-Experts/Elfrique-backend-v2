"use strict";
const { Model } = require("sequelize");
const { nanoid } = require("nanoid");
module.exports = (sequelize, DataTypes) => {
  class eventReferral extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      eventReferral.belongsTo(models.event);
    }
  }
  eventReferral.init(
    {
      id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10),
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      referral_code: DataTypes.STRING,
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "eventReferral",
    }
  );
  return eventReferral;
};
