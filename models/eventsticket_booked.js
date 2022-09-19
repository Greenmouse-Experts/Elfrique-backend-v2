"use strict";
const { Model } = require("sequelize");
const { nanoid } = require("nanoid");
module.exports = (sequelize, DataTypes) => {
  class eventsticket_booked extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      eventsticket_booked.belongsTo(models.event);
      eventsticket_booked.belongsTo(models.eventsTicket);
    }
  }
  eventsticket_booked.init(
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
      phone_no: DataTypes.STRING,
      reference: DataTypes.STRING,
      payment_method: DataTypes.STRING,
      currency: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      amount: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "eventsticket_booked",
    }
  );
  return eventsticket_booked;
};
