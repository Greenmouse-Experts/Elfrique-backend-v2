"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("referrals", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      referral_id: {
        allowNull: true,
        type: Sequelize.STRING,
        references: {
          model: "adminusers",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      user_id: {
        allowNull: true,
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
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("referrals");
  },
};
