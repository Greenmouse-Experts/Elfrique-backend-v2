"use strict";
const { Model } = require("sequelize");
const { nanoid } = require("nanoid");
module.exports = (sequelize, DataTypes) => {
  class event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      event.belongsTo(models.adminuser);
      event.hasMany(models.eventsTicket);
      event.hasMany(models.eventsticket_booked);
      event.hasMany(models.eventReferral);
    }
  }
  event.init(
    {
      id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10),
      },
      title: DataTypes.STRING,
      identification_name: DataTypes.STRING,
      location: DataTypes.STRING,
      country: DataTypes.STRING,
      state: DataTypes.STRING,
      city: DataTypes.STRING,
      venue: DataTypes.STRING,
      startdate: DataTypes.DATE,
      enddate: DataTypes.STRING,
      image: DataTypes.STRING,
      description: DataTypes.STRING,
      organisation: DataTypes.STRING,
      paymentgateway: DataTypes.STRING,
      timezone: DataTypes.STRING,
      category: DataTypes.STRING,
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "event",
    }
  );
  return event;
};
