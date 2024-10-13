"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const user_model_interface_1 = require("./interfaces/user.model.interface");
const role_model_1 = tslib_1.__importDefault(require("./role.model"));
const userRole_model_1 = tslib_1.__importDefault(require("./userRole.model"));
const cellMember_model_1 = tslib_1.__importDefault(require("./cellMember.model"));
const leave_model_1 = tslib_1.__importDefault(require("./leave.model"));
const sensation_model_1 = tslib_1.__importDefault(require("./sensation.model"));
const sensationComment_model_1 = tslib_1.__importDefault(require("./sensationComment.model"));
const sensationLike_model_1 = tslib_1.__importDefault(require("./sensationLike.model"));
const student_model_1 = tslib_1.__importDefault(require("./student.model"));
let User = class User extends sequelize_typescript_1.Model {
};
tslib_1.__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_1.DataTypes.INTEGER),
    tslib_1.__metadata("design:type", Number)
], User.prototype, "id", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.Unique,
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)(sequelize_1.DataTypes.STRING),
    tslib_1.__metadata("design:type", String)
], User.prototype, "email", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_1.DataTypes.STRING),
    tslib_1.__metadata("design:type", String)
], User.prototype, "first_name", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_1.DataTypes.STRING),
    tslib_1.__metadata("design:type", String)
], User.prototype, "last_name", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_1.DataTypes.STRING),
    tslib_1.__metadata("design:type", String)
], User.prototype, "full_name", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_1.DataTypes.STRING),
    tslib_1.__metadata("design:type", String)
], User.prototype, "phone", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.Column,
    tslib_1.__metadata("design:type", String)
], User.prototype, "mobile", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_1.DataTypes.TEXT),
    tslib_1.__metadata("design:type", String)
], User.prototype, "password", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_1.DataTypes.STRING),
    tslib_1.__metadata("design:type", String)
], User.prototype, "timezone", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_1.DataTypes.DATE),
    tslib_1.__metadata("design:type", Date)
], User.prototype, "birth_date", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_1.DataTypes.STRING),
    tslib_1.__metadata("design:type", String)
], User.prototype, "gender", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_1.DataTypes.STRING),
    tslib_1.__metadata("design:type", String)
], User.prototype, "address1", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_1.DataTypes.STRING),
    tslib_1.__metadata("design:type", String)
], User.prototype, "address2", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.Column,
    tslib_1.__metadata("design:type", String)
], User.prototype, "city", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_1.DataTypes.STRING),
    tslib_1.__metadata("design:type", String)
], User.prototype, "state", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_1.DataTypes.STRING),
    tslib_1.__metadata("design:type", String)
], User.prototype, "country", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.Column,
    tslib_1.__metadata("design:type", String)
], User.prototype, "zip", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User),
    (0, sequelize_typescript_1.Column)(sequelize_1.DataTypes.INTEGER),
    tslib_1.__metadata("design:type", Number)
], User.prototype, "added_by", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_1.DataTypes.ENUM(...Object.values(user_model_interface_1.USER_STATUS))),
    tslib_1.__metadata("design:type", String)
], User.prototype, "active", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.Default)(false),
    (0, sequelize_typescript_1.Column)(sequelize_1.DataTypes.BOOLEAN),
    tslib_1.__metadata("design:type", Boolean)
], User.prototype, "verified", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.Column,
    tslib_1.__metadata("design:type", String)
], User.prototype, "profile_image", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.CreatedAt,
    tslib_1.__metadata("design:type", Date)
], User.prototype, "created_at", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.UpdatedAt,
    tslib_1.__metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
tslib_1.__decorate([
    sequelize_typescript_1.DeletedAt,
    tslib_1.__metadata("design:type", Date)
], User.prototype, "deleted_at", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User, { foreignKey: 'added_by', constraints: false, as: 'added_by_user' }),
    tslib_1.__metadata("design:type", User)
], User.prototype, "added_by_user", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => role_model_1.default, {
        through: () => userRole_model_1.default,
        foreignKey: 'user_id',
        otherKey: 'role_id',
        constraints: false,
    }),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "roles", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.HasMany)(() => cellMember_model_1.default, { foreignKey: 'user_id', constraints: false }),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "cellMember", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.HasMany)(() => leave_model_1.default, { foreignKey: 'user_id', constraints: false }),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "leave", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.HasMany)(() => sensation_model_1.default, { foreignKey: 'user_id', constraints: false }),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "sensation", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.HasMany)(() => sensationComment_model_1.default, { foreignKey: 'user_id', constraints: false }),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "sensationComment", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.HasMany)(() => sensationLike_model_1.default, { foreignKey: 'user_id', constraints: false }),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "sensationlLike", void 0);
tslib_1.__decorate([
    (0, sequelize_typescript_1.HasMany)(() => student_model_1.default, { foreignKey: 'user_id', constraints: false }),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "student", void 0);
User = tslib_1.__decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        paranoid: true,
        tableName: 'users',
        defaultScope: { attributes: { exclude: ['password', 'secret_2fa', 'reset_pass_token'] } },
        scopes: { withPassword: { attributes: { exclude: [] } } },
        indexes: [{ fields: ['email'], unique: true, where: { deleted_at: null } }],
    })
], User);
exports.default = User;
//# sourceMappingURL=user.model.js.map