'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'role_permissions',
        {
          id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
          role_id: { type: Sequelize.INTEGER, allowNull: false },
          permission_id: { type: Sequelize.INTEGER, allowNull: false },
          feature_id: { type: Sequelize.INTEGER, allowNull: false },
          role_permission_key: { type: Sequelize.INTEGER, allowNull: false, unique: true },
          access: { type: Sequelize.STRING, allowNull: false },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
          updated_at: { type: Sequelize.DATE, allowNull: false },
          deleted_at: { type: Sequelize.DATE },
        },
        { transaction: t },
      );
      await queryInterface.addConstraint('role_permissions', {
        type: 'foreign key',
        name: 'role_permission_role_id_fk',
        fields: ['role_id'],
        references: {
          table: 'roles',
          field: 'id',
        },
        transaction: t,
      });
      await queryInterface.addConstraint('role_permissions', {
        type: 'foreign key',
        name: 'permission_id_permission_id_fk',
        fields: ['permission_id'],
        references: {
          table: 'permissions',
          field: 'id',
        },
        transaction: t,
      });
      await queryInterface.addConstraint('role_permissions', {
        type: 'foreign key',
        name: 'permission_id_feature_id_fk',
        fields: ['feature_id'],
        references: {
          table: 'features',
          field: 'id',
        },
        transaction: t,
      });
      await queryInterface.addIndex('role_permissions', {
        name: 'unique_role_permission_key_uk',
        fields: ['role_permission_key'],
        unique: true,
        where: {
          deleted_at: null,
        },
        transaction: t,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('role_permissions', { transaction: t, cascade: true });
    });
  },
};
