'use strict';

const sequelize = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (t) => {
            await queryInterface.createTable(
                'exam_results',
                {
                    id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
                    student_id: { type: Sequelize.INTEGER },
                    exam_id: { type: Sequelize.INTEGER },
                    subject_id: { type: Sequelize.INTEGER },
                    theory_total: { type: Sequelize.INTEGER },
                    practical_total: { type: Sequelize.INTEGER },
                    theory_obtain_mark: { type: Sequelize.INTEGER },
                    practical_obtain_mark: { type: Sequelize.INTEGER },
                    total_marks: { type: Sequelize.INTEGER },
                    total_obtain_marks: { type: Sequelize.INTEGER },
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
            await queryInterface.dropTable('exam_results', { transaction: t, cascade: true });
        });
    },
};
