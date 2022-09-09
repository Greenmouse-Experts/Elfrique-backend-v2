const { nanoid } = require("nanoid");
const { Model } = require("sequelize");
const { none } = require("../helpers/upload");
module.exports = (sequelize, DataTypes) => {
  class eventjob extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      eventjob.belongsTo(models.event, {
        foreignKey: "eventId",
      });
      eventjob.belongsTo(models.adminuser, {
        foreignKey: "userassignId",
      });
      //event.hasMany(models.eventjob)
    }
  }
  eventjob.init(
    {
      id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10),
      },
      eventId: {
        type: DataTypes.STRING,
      },
      userassignId: {
        type: DataTypes.STRING,
      },
      job_type: {
        type: DataTypes.STRING,
      },
      job_description: {
        type: DataTypes.TEXT,
      },
      budget: {
        type: DataTypes.STRING,
        required: true,
      },
      location: {
        type: DataTypes.STRING,
      },
      assign: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
      img_id: {
        type: DataTypes.STRING,
      },
      img_url: {
        type: DataTypes.STRING,
      },
      eventCategory: {
        type: DataTypes.ENUM(
          "eventdecorators",
          "photographers",
          "caterers",
          "discJockey",
          "fashionDesigners",
          "eventPlaners",
          "invitationsAndPrinting",
          "makeUpArtist",
          "others"
        ),
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "eventjob",
      timestamps: true,
    }
  );
  return eventjob;
};
