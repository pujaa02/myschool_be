import { Model } from 'sequelize-typescript';
import { RequiredUserAttributes, USER_STATUS, UserAttributes } from './interfaces/user.model.interface';
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
    state_id: number;
    country_id: number;
    zip: string;
    active: USER_STATUS;
    verified: boolean;
    profile_image: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
