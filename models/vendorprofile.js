
const {nanoid} = require('nanoid');
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class vendorprofile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    //   vendorprofile.belongsTo(models.eventjob, {
    //       foreignKey: "jobId"
    //   });
      vendorprofile.belongsTo(models.adminuser, {
          foreignKey: "userId"
     });
    //   vendorprofile.belongsTo(models.adminuser, {
    //     foreignKey: "to"
    // });
      //event.hasMany(models.vendorprofile)
    }
  }
  vendorprofile.init(
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
    description: {
      type: DataTypes.TEXT
    },
    tag:{
        type: DataTypes.STRING
    },
    img_id: {
      type: DataTypes.TEXT
    },
    img_url: {
      type: DataTypes.TEXT
    }
    },
    {
      sequelize,
      modelName: "vendorprofile",
      timestamps: true
    }
  );
  return vendorprofile;
};
