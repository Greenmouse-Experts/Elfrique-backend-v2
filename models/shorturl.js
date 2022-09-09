const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class url extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //eventjob.belongsTo(models.event);
      url.belongsTo(models.adminuser,{
        foreignKey: "userId"
      });
      //event.hasMany(models.eventjob)
    }
  }
  url.init(
    {
      id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10),
      },
      urlCode: {
        type: DataTypes.STRING,
      },
      longUrl: {
        type: DataTypes.STRING,
      },
      shortUrl: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "url",
      timestamps: true,
    }
  );
  return url;
};
