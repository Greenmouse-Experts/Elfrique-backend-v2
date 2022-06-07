const {nanoid} = require('nanoid');
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ads extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //eventjob.belongsTo(models.event);
      ads.belongsTo(models.adminuser, {
        foreignKey: "userId"
      });
      //event.hasMany(models.eventjob)
    }
  }
  ads.init(
    {
        id: {
            type: DataTypes.STRING(10),
            autoincrement: false,
            allowNull: false,
            primaryKey: true,
            defaultValue: () => nanoid(10)
        },
        title:{
            type: DataTypes.STRING
        },
        ref_link:{
            type: DataTypes.STRING
        },
        img_id:{
            type: DataTypes.STRING
        },
        img_url:{
            type: DataTypes.STRING
        }
    },
    {
      sequelize,
      modelName: "ads",
      timestamps: true
    }
  );
  return ads;
};

