
const {nanoid} = require('nanoid');
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class adssubscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    //   adssubscription.belongsTo(models.eventjob, {
    //       foreignKey: "jobId"
    //   });
      adssubscription.belongsTo(models.adminuser, {
          foreignKey: "userId"
     });
    //   adssubscription.belongsTo(models.adminuser, {
    //     foreignKey: "to"
    // });
      //event.hasMany(models.adssubscription)
    }
  }
  adssubscription.init(
    {
    id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    // userId:{
    //     type: DataTypes.INTEGER,
    //     references:{ 
    //       model: 'adminusers',
    //       key: 'id',
    //   }
    // },
    sub_type:{
      type: DataTypes.ENUM,
      values: ["home_page_left", "home_page_right", "home_page_slide", "inner_page_left", "inner_page_right"],
      defaultValue: null
    },
    status: {
      type: DataTypes.ENUM,
      values: ["active", "expired"],
      defaultValue: null
      
    },
    end_date:{
        type: DataTypes.DATE,
    },
    },
    {
      sequelize,
      modelName: "adssubscription",
      timestamps: true,
      tableName: "adssubscriptions"
    }
  );
  return adssubscription;
};
