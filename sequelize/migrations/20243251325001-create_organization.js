'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'user_organizations',
        {
          id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
          user_id: { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' } },
          user_status: { type: Sequelize.STRING, allowNull: false,  },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
          updated_at: { type: Sequelize.DATE, allowNull: false },
          deleted_at: { type: Sequelize.DATE },
        },
        { transaction: t },
      );
      await queryInterface.addIndex('user_organizations', {
        unique: true,
        fields: ['user_id' ],
        type: 'UNIQUE',
        where: { deleted_at: null },
        using: 'BTREE',
        transaction: t,
      });
      await queryInterface.addConstraint('user_organizations', {
        type: 'foreign key',
        name: 'user_id_fk',
        fields: ['id'],
        references: {
          table: 'users',
          field: 'id',
        },
        transaction: t,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('user_organizations', { transaction: t, cascade: true });
    });
  },
};
