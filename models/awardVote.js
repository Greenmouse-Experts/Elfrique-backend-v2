"use strict";
const { Model } = require("sequelize");
const { nanoid } = require("nanoid");
module.exports = (sequelize, DataTypes) => {
  class awardVote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      awardVote.belongsTo(models.awardContest);
      awardVote.belongsTo(models.awardNominees);
    }
  }
  awardVote.init(
    {
      id: {
        type: DataTypes.STRING,
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid,
      },
      // id: {
      //   autoIncrement: true,
      //   type: DataTypes.INTEGER.UNSIGNED,
      //   allowNull: false,
      //   primaryKey: true,
      // },
      voters_name: DataTypes.STRING,
      voters_email: DataTypes.STRING,
      voters_phone: DataTypes.STRING,
      // number: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true
      // },
      date_added: DataTypes.STRING,
      reference: DataTypes.STRING,
      numberOfVote: DataTypes.INTEGER,
      // contestantId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   field: "contestant_id",
      // },
      // votingDetailsId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   field: "voting_details_id",
      // },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "payment_method",
      },
      paymentStatus: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "payment_status",
      },
      dayAdded: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "day_added",
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      continent: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paymentGateway: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "payment_gateway",
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      gatewayResponseCode: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "gateway_response_code",
      },
      convertedAmount: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "converted_amount",
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      currencyCode: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "currency_code",
      },
    },
    {
      sequelize,
      modelName: "awardVote",
    }
  );
  return awardVote;
};
