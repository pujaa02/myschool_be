'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (t) => {
            await queryInterface.createTable(
                'cellMembers',
                {
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    name: { type: Sequelize.STRING },
                    member_image: { type: Sequelize.STRING },
                    committe_id: { type: Sequelize.INTEGER },
                    user_id: { type: Sequelize.INTEGER },
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
            await queryInterface.dropTable('cellMembers', { transaction: t, cascade: true });
        });
    },
};
