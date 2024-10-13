'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (t) => {
            await queryInterface.createTable(
                'role_permissions',
                {
                    role_id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true },
                    permission_id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true },
                    status: { type: Sequelize.ENUM('ACTIVE', 'INACTIVE'), allowNull: false },
                    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
                    updated_at: { type: Sequelize.DATE, allowNull: false },
                    deleted_at: { type: Sequelize.DATE },
                },
                { transaction: t },
            );
       
            await queryInterface.sequelize.query(
                `ALTER TABLE role_permissions ADD CONSTRAINT role_permissions_role_id_permission_id_org_id_fk
          FOREIGN KEY (role_id)
          REFERENCES roles (id)`,
                { transaction: t },
            );
        });

        await queryInterface.sequelize.query(
            `ALTER TABLE role_permissions ADD CONSTRAINT role_permissions_permission_id_id_fk
          FOREIGN KEY (permission_id)
          REFERENCES permissions (id)`,
        );
    },

    async down(queryInterface) {
        await queryInterface.sequelize.transaction(async (t) => {
            await queryInterface.dropTable('role_permissions', { transaction: t, cascade: true });
        });
    },
};
