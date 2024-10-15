'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'users',
        {
          id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
          email: { type: Sequelize.STRING, allowNull: false },
          first_name: { type: Sequelize.STRING },
          last_name: { type: Sequelize.STRING },
          username: { type: Sequelize.STRING, allowNull: false },
          contact: { type: Sequelize.STRING },
          profile_image: { type: Sequelize.STRING },
          password: { type: Sequelize.TEXT },
          added_by: { type: Sequelize.INTEGER },
          timezone: { type: Sequelize.STRING },
          date_format: { type: Sequelize.STRING, allowNull: false, defaultValue: 'MM/dd/yyyy' },
          birth_date: { type: Sequelize.DATE },
          gender: { type: Sequelize.STRING },
          address1: { type: Sequelize.STRING },
          address2: { type: Sequelize.STRING },
          city: { type: Sequelize.STRING },
          country: { type: Sequelize.STRING },
          state: { type: Sequelize.STRING },
          zip: { type: Sequelize.STRING },
          active: { type: Sequelize.ENUM('ACTIVE', 'INACTIVE'), allowNull: false, defaultValue: 'ACTIVE' },
          last_login_time: { type: Sequelize.DATE },
          verified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
          updated_at: { type: Sequelize.DATE, allowNull: false },
          deleted_at: { type: Sequelize.DATE },
          pass_logs: { type: Sequelize.JSON },
        },
        { transaction: t },
      );
      await queryInterface.addIndex('users', {
        name: 'unique_email_uk',
        fields: ['email'],
        unique: true,
        where: {
          deleted_at: null,
        },
        transaction: t,
      });
      await queryInterface.addConstraint('users', {
        type: 'foreign key',
        name: 'users_added_by_fk',
        fields: ['added_by'],
        references: {
          table: 'users',
          field: 'id',
        },
        transaction: t,
      });
    });
  },

  async down(queryInterface, _) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('users', { transaction: t, cascade: true });
    });
  },
};
