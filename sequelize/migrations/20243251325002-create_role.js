'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (t) => {
            await queryInterface.createTable(
                'roles',
                {
                    id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
                    name: { type: Sequelize.STRING, allowNull: false },
                    description: { type: Sequelize.STRING },
                    is_system: { type: Sequelize.BOOLEAN, allowNull: false },
                    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
                    updated_at: { type: Sequelize.DATE, allowNull: false },
                    deleted_at: { type: Sequelize.DATE },
                },
                { transaction: t },
            );
        });
    },

    async down(queryInterface, _) {
        await queryInterface.sequelize.transaction(async (t) => {
            await queryInterface.dropTable('roles', { transaction: t, cascade: true });
        });
    },
};
