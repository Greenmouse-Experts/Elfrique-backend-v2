"use strict";
const { Model } = require("sequelize");
const { nanoid } = require("nanoid");
module.exports = (sequelize, DataTypes) => {
  class eventsTicket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      eventsTicket.belongsTo(models.event);
      eventsTicket.hasMany(models.eventsticket_booked);
    }
  }
  eventsTicket.init(
    {
      id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10),
      },
      name: DataTypes.STRING,
      quantity: DataTypes.STRING,
      price: DataTypes.STRING,
      salesstart: DataTypes.DATE,
      salesend: DataTypes.DATE,
      eventname: DataTypes.STRING,
      booked: DataTypes.STRING,
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "eventsTicket",
    }
  );
  return eventsTicket;
};
