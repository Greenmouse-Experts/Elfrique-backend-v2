const {nanoid} = require('nanoid');
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //eventjob.belongsTo(models.event);
      message.belongsTo(models.adminuser, {
        foreignKey: "sender"
      });
      message.belongsTo(models.conversation, {
        foreignKey: "conversationId"
      });
      //event.hasMany(models.eventjob)
    }
  }
  message.init(
    {
        id: {
            type: DataTypes.STRING(10),
            autoincrement: false,
            allowNull: false,
            primaryKey: true,
            defaultValue: () => nanoid(10)
        },
       conversationId: {
           type: DataTypes.STRING,
            references:{ 
                model: 'conversations',
                key: 'id',
            }
           
       },
       sender: {
           type: DataTypes.STRING,
           references:{ 
            model: 'adminusers',
            key: 'id',
        }
       },
       text: {
           type: DataTypes.TEXT,
       }
    },
    {
      sequelize,
      modelName: "message",
      timestamps: true
    }
  );
  return message;
};

