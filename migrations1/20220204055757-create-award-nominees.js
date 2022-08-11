"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("awardNominees", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      fullname: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      contestantnumber: {
        type: Sequelize.STRING,
      },
      about: {
        type: Sequelize.TEXT,
      },
      awardContestId: {
        type: Sequelize.STRING,
        references: {
          model: "awardContests",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      awardCategoriesId: {
        type: Sequelize.STRING,
        references: {
          model: "awardCategories",
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
    await queryInterface.dropTable("awardNominees");
  },
};
