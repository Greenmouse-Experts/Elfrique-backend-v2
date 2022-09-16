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
        defaultValue: () => nanoid(10),
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
      payment_method: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      payment_status: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      payment_gateway: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      gateway_response_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      converted_amount: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "awardVote",
    }
  );
  return awardVote;
};
