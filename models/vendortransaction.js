
const {nanoid} = require('nanoid');
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class vendortransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    //   vendortransaction.belongsTo(models.eventjob, {
    //       foreignKey: "jobId"
    //   });
      vendortransaction.belongsTo(models.adminuser, {
          foreignKey: "userId"
     });
    //   vendortransaction.belongsTo(models.adminuser, {
    //     foreignKey: "to"
    // });
      //event.hasMany(models.vendortransaction)
    }
  }
  vendortransaction.init(
    {
    id: {
        type: DataTypes.STRING(10),
        autoincrement: false,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(10)
    },
    userId:{
        type: DataTypes.STRING,
        references:{ 
          model: 'adminusers',
          key: 'id',
      }
    },
    ref_no: {
        type: DataTypes.STRING
    },
    sub_type: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.STRING
    },
    interval: {
        type: DataTypes.STRING
    },
    status:{
      type: DataTypes.STRING
    },
    start_date: {
        type: DataTypes.DATE
    },
    end_date:{
        type: DataTypes.DATE
    }
    },
    {
      sequelize,
      modelName: "vendortransaction",
      timestamps: true
    }
  );
  return vendortransaction;
};
