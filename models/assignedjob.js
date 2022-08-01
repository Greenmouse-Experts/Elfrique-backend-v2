

const {nanoid} = require('nanoid');
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class assignjob extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      assignjob.belongsTo(models.eventjob, {
          foreignKey: "eventjobId"
      });
      assignjob.belongsTo(models.adminuser, {
        foreignKey: "userId"
      });
      //event.hasMany(models.eventjob)
    }
  }
  assignjob.init(
    {
    id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    },
    {
      sequelize,
      modelName: "assignjob",
      timestamps: true
    }
  );
  return assignjob;
};
