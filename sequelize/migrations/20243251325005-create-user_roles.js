'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.createTable(
                'user_roles',
                {
                    id: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
                    role_id: { type: Sequelize.INTEGER, allowNull: false },
                    user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
                    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW, allowNull: false },
                    updated_at: { type: Sequelize.DATE, allowNull: false },
                    deleted_at: { type: Sequelize.DATE },
                },
                { transaction },
            );
            await queryInterface.addIndex('user_roles', {
                unique: true,
                fields: ['user_id', 'role_id'],
                type: 'UNIQUE',
                where: { deleted_at: null },
                using: 'BTREE',
                transaction,
            });
        });
    },

    async down(queryInterface, _) {
        await queryInterface.dropTable('user_roles', { cascade: true });
    },
};
