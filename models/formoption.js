"use strict";
const { Model } = require("sequelize");
const {nanoid} = require("nanoid");
module.exports = (sequelize, DataTypes) => {
  class formOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      formOption.belongsTo(models.eventform);
      formOption.belongsTo(models.formQuestion);
    }
  }
  formOption.init(
    {
      id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
      value: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      eventformId: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      formQuestionId: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "formOption",
      timestamps: true,
      paranoid: true,
      tableName: "formOptions",
    }
  );
  return formOption;
};
