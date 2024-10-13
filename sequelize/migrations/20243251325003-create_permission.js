'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (t) => {
            // Create Table
            await queryInterface.createTable(
                'permissions',
                {
                    permission_group_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                        references: { model: 'permission_groups', key: 'id' },
                    },
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    name: { type: Sequelize.STRING, allowNull: false },
                    order: { type: Sequelize.INTEGER, allowNull: false },
                    is_disabled: { type: Sequelize.BOOLEAN, allowNull: false },
                    status: { type: Sequelize.ENUM('ACTIVE', 'INACTIVE'), allowNull: false },
                    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
                    updated_at: { type: Sequelize.DATE, allowNull: false },
                    deleted_at: { type: Sequelize.DATE },
                },
                { transaction: t },
            );
            // Create Unique Index
            await queryInterface.addIndex('permissions', {
                fields: ['permission_group_id', 'name'],
                unique: true,
                type: 'UNIQUE',
                using: 'BTREE',
                transaction: t,
            });
            await queryInterface.sequelize.query(`SELECT create_reference_table('permissions');`, {
                transaction: t,
            });
        });
    },

    async down(queryInterface) {
        await queryInterface.sequelize.transaction(async (t) => {
            await queryInterface.dropTable('permissions', { transaction: t });
        });
    },
};
