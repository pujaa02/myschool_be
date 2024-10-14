'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'users',
          'role_id',
          {
            type: Sequelize.INTEGER,
          },
          { transaction: t },
        ),
        queryInterface.addConstraint('users', {
          type: 'foreign key',
          name: 'users_role_id_fk',
          fields: ['role_id'],
          references: {
            table: 'roles',
            field: 'id',
          },
          transaction: t,
        }),
      ]);
    });
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([queryInterface.removeColumn('users', 'role_id', { transaction: t })]);
    });
  },
};
