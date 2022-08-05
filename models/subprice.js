
const {nanoid} = require('nanoid');
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class subprice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    //   subprice.belongsTo(models.eventjob, {
    //       foreignKey: "jobId"
    //   });
    //   subprice.belongsTo(models.adminuser, {
    //       foreignKey: "userId"
    //  });
    //   subprice.belongsTo(models.adminuser, {
    //     foreignKey: "to"
    // });
      //event.hasMany(models.subprice)
    }
  }
  subprice.init(
    {
    id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    sub_type:{
      type: DataTypes.ENUM,
      values: ["basic", "exclusive", "home_page_left", "home_page_right", "home_page_slide", "inner_page_left", "inner_page_right" ],
      defaultValue: null
    },
    price: {
      type: DataTypes.STRING,
    },
    interval: {
      type: DataTypes.STRING,
    },
    plan_id: {
      type: DataTypes.STRING,
    },
    plan_code:{
      type: DataTypes.STRING,
    },
    page_url: {
      type: DataTypes.STRING,
    },
    page_id: {
      type: DataTypes.STRING,
    },
    },
    {
      sequelize,
      modelName: "subprice",
      timestamps: true
    }
  );
  return subprice;
};
