
const {nanoid} = require('nanoid');
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      review.belongsTo(models.eventjob, {
          foreignKey: "jobId"
      });
      review.belongsTo(models.adminuser, {
          foreignKey: "from"
      });
      review.belongsTo(models.adminuser, {
        foreignKey: "to"
    });
      //event.hasMany(models.review)
    }
  }
  review.init(
    {
    id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    jobId: {
        type: DataTypes.STRING,
        references:{ 
            model: 'eventjobs',
            key: 'id',
        }
    },
    from: {
        type: DataTypes.STRING,
        references:{ 
            model: 'adminusers',
            key: 'id',
        }
    },
    to:  {
        type: DataTypes.STRING,
        references:{ 
            model: 'adminusers',
            key: 'id',
        }
    },
    text: {
        type: DataTypes.TEXT,
    },
    rating: {
        type: DataTypes.FLOAT
    }
    },
    {
      sequelize,
      modelName: "review",
      timestamps: true
    }
  );
  return review;
};
