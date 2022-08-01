"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("contestInfos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      details: {
        type: Sequelize.TEXT,
      },
      votingContestId: {
        type: Sequelize.STRING,
        references: {
          model: "votingContests",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      awardContestId: {
        type: Sequelize.STRING,
        references: {
          model: "awardContests",
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
    await queryInterface.dropTable("contestInfos");
  },
};
