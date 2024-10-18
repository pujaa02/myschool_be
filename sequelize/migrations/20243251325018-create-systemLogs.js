'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'system_logs',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          title: {
            type: Sequelize.STRING,
            defaultValue: null,
          },
          slug: {
            type: Sequelize.STRING,
            defaultValue: null,
          },
          description: {
            type: Sequelize.STRING,
            defaultValue: null,
          },
          module_id: {
            type: Sequelize.INTEGER,
            defaultValue: null,
          },
          feature_id: {
            type: Sequelize.INTEGER,
            defaultValue: null,
          },
          user_id: {
            type: Sequelize.INTEGER,
            defaultValue: null,
          },
          is_language_considered: {
            type: Sequelize.BOOLEAN,
            defaultValue: null,
          },
          created_by: {
            allowNull: true,
            type: Sequelize.INTEGER,
          },
          updated_by: {
            allowNull: true,
            type: Sequelize.INTEGER,
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          deleted_at: {
            type: Sequelize.DATE,
          },
        },
        { transaction: t },
      );
      await queryInterface.addConstraint('system_logs', {
        type: 'foreign key',
        name: 'feature_system_log_id_fk',
        fields: ['feature_id'],
        references: {
          table: 'features',
          field: 'id',
        },
        transaction: t,
      });
      await queryInterface.addConstraint('system_logs', {
        type: 'foreign key',
        name: 'user_system_log_id_fk',
        fields: ['user_id'],
        references: {
          table: 'users',
          field: 'id',
        },
        transaction: t,
      });
      await queryInterface.addConstraint('system_logs', {
        type: 'foreign key',
        name: 'created_by_user_id_fk',
        fields: ['created_by'],
        references: {
          table: 'users',
          field: 'id',
        },
        transaction: t,
      });
      await queryInterface.addConstraint('system_logs', {
        type: 'foreign key',
        name: 'updated_by_user_id_fk',
        fields: ['updated_by'],
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
      await queryInterface.dropTable('system_logs', { transaction: t, cascade: true });
    });
  },
};
