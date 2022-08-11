"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("awardContests", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      votelimit: {
        type: Sequelize.STRING,
      },
      startdate: {
        type: Sequelize.STRING,
      },
      closedate: {
        type: Sequelize.STRING,
      },
      timezone: {
        type: Sequelize.STRING,
      },
      paymentgateway: {
        type: Sequelize.STRING,
      },
      fee: {
        type: Sequelize.STRING,
      },
      packagestatus: {
        type: Sequelize.STRING,
      },
      categories: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      adminuserId: {
        type: Sequelize.STRING,
        references: {
          model: "adminusers",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("awardContests");
  },
};
