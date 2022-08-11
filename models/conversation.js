const {nanoid} = require('nanoid');
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //eventjob.belongsTo(models.event);
    conversation.belongsTo(models.adminuser, {
        foreignKey: "senderId",
        as: "sender"
      });

    conversation.belongsTo(models.adminuser, {
        foreignKey: "receiverId",
        as: "receiver",
    });
      //event.hasMany(models.eventjob)
    }
  }
  conversation.init(
    {
        id: {
            type: DataTypes.STRING(10),
            autoincrement: false,
            allowNull: false,
            primaryKey: true,
            defaultValue: () => nanoid(10)
        },
        senderId:{
            allowNull: true,
            type: DataTypes.STRING,  
          },
        receiverId: {
            allowNull: true,
            type: DataTypes.STRING,
        },
        message: {
            allowNull: true,
            type: DataTypes.TEXT
        },
        read_status: {
            allowNull: true,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    },
    {
      sequelize,
      modelName: "conversation",
      timestamps: true,
      paranoid: true,
      tableName: 'conversations'
    }
  );
  return conversation;
};

