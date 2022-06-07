
const {nanoid} = require('nanoid');
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class vendorsub extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    //   vendorsub.belongsTo(models.eventjob, {
    //       foreignKey: "jobId"
    //   });
      vendorsub.belongsTo(models.adminuser, {
          foreignKey: "userId"
     });
    //   vendorsub.belongsTo(models.adminuser, {
    //     foreignKey: "to"
    // });
      //event.hasMany(models.vendorsub)
    }
  }
  vendorsub.init(
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
      values: ["free", "basic", "exclusive"],
      defaultValue: "free"
    },
    status: {
      type: DataTypes.ENUM,
      values: ["active", "expired"],
      defaultValue: null,
    },
    end_date:{
        type: DataTypes.DATE,
    },
    },
    {
      sequelize,
      modelName: "vendorsub",
      timestamps: true,
      tableName: "vendorsubs"
    }
  );
  return vendorsub;
};
