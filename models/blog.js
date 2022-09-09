"use strict";
const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      blog.belongsTo(models.adminuser, {
        foreignKey: "userId",
      });
    }
  }
  blog.init(
    {
      id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10),
      },
      // userId:{
      //     type: DataTypes.INTEGER,
      //     references:{
      //       model: 'adminusers',
      //       key: 'id',
      //   }
      // },
      details: {
        type: DataTypes.TEXT,
      },
      title: {
        type: DataTypes.TEXT,
      },
      author: {
        type: DataTypes.STRING,
        defaultValue: "elfrique",
      },
      img_id: {
        type: DataTypes.TEXT,
      },
      img_url: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "blog",
    }
  );
  return blog;
};
