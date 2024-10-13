import { Model } from 'sequelize-typescript';
import { HasManyCreateAssociationMixin } from 'sequelize';
import { RequiredUserAttributes, USER_STATUS, UserAttributes } from './interfaces/user.model.interface';
import Role from './role.model';
import UserRole from './userRole.model';
import CellMember from './cellMember.model';
import Leave from './leave.model';
import Sensation from './sensation.model';
import SensationComment from './sensationComment.model';
import SensationLike from './sensationLike.model';
import Student from './student.model';
export default class User extends Model<UserAttributes, RequiredUserAttributes> {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    phone: string;
    mobile: string;
    password: string;
    timezone: string;
    birth_date: Date;
    gender: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    added_by: number;
    active: USER_STATUS;
    verified: boolean;
    profile_image: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
    added_by_user: User;
    roles: Role[];
    createUser_role: HasManyCreateAssociationMixin<UserRole, 'user_id'>;
    cellMember: CellMember[];
    leave: Leave[];
    sensation: Sensation[];
    sensationComment: SensationComment[];
    sensationlLike: SensationLike[];
    student: Student[];
}
//# sourceMappingURL=user.model.d.ts.map