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
          zip: { type: Sequelize.STRING },
          first_name: { type: Sequelize.STRING },
          last_name: { type: Sequelize.STRING },
          password: { type: Sequelize.TEXT },
          address1: { type: Sequelize.STRING },
          address2: { type: Sequelize.STRING },
          birth_date: { type: Sequelize.DATE },
          city: { type: Sequelize.STRING },
          added_by: { type: Sequelize.INTEGER },
          gender: { type: Sequelize.STRING },
          phone: { type: Sequelize.STRING },
          mobile: { type: Sequelize.STRING },
          profile_image: { type: Sequelize.STRING },
          timezone: { type: Sequelize.STRING },
          state: { type: Sequelize.STRING },
          country: { type: Sequelize.STRING },
          social_media: { type: Sequelize.JSONB },
          verified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
          active: { type: Sequelize.ENUM('ACTIVE', 'INACTIVE'), allowNull: false, defaultValue: 'ACTIVE' },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
          updated_at: { type: Sequelize.DATE, allowNull: false },
          deleted_at: { type: Sequelize.DATE },
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
