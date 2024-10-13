'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (t) => {
            await queryInterface.createTable(
                'permission_groups',
                {
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    name: { type: Sequelize.STRING, allowNull: false, unique: true },
                    parent_section: { type: Sequelize.STRING, allowNull: false },
                    child_section: { type: Sequelize.STRING, allowNull: false },
                    status: { type: Sequelize.ENUM('ACTIVE', 'INACTIVE'), allowNull: false },
                    updated_at: { type: Sequelize.DATE, allowNull: false },
                    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
                    deleted_at: { type: Sequelize.DATE },
                },
                { transaction: t },
            );
            await queryInterface.sequelize.query(`SELECT create_reference_table('permission_groups')`, { transaction: t });
        });
    },

    async down(queryInterface) {
        await queryInterface.sequelize.transaction(async (t) => {
            await queryInterface.dropTable('permission_groups', { transaction: t });
        });
    },
};
