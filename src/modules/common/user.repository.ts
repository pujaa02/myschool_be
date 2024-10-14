import { RoleEnum, FeaturesEnum, PermissionEnum } from "@/common/constants/enum.constant";
import { HttpException } from "@/common/helper/response/httpException";
import { DeleteArgsType } from "@/common/interfaces/general/database.interface";
import { LanguageEnum } from "@/common/interfaces/general/general.interface";
import { generateRandomPassword, findDuplicates, generateSlugifyForModel } from "@/common/util";
import db from "@/models";
import { USER_STATUS, UserAttributes } from "@/models/interfaces/user.model.interface";
import LanguageModel from "@/models/language.model";
import Role from "@/models/role.model";
import User from "@/models/user.model";
import { json } from "express";
import _ from "lodash";
import { parse } from "path";
import { Transaction, Op, ModelCtor } from "sequelize";
import { TokenDataInterface } from "../auth/interfaces/auth.interfaces";
import RoleRepo from "../role/repository/role.repository";
import LogRepo from "../systemLogs/repository/systemLog.repository";
import { BuildUserArgs, BuildUserResp, BuildBulkUserArgs } from "../user/interfaces/user.interfaces";
import { bulkUserCreateNormalizer } from "../user/normalizer/user-bulk-create.normalizer";
import ManagerRepo from "../user/repository/manager.repository";
import PrivateIndividualRepo from "../user/repository/privateIndividual.repository";
import BaseRepository from "./base.repository";


export default class UserRepo extends BaseRepository<User> {
    private logRepo = new LogRepo();
    readonly roleRepository = new RoleRepo();

    constructor() {
        super(User.name);
        this.roleRepository = new RoleRepo();
    }

    readonly checkUserData = async ({
        body,
        user,
        transaction,
    }: {
        body: Request['body'];
        user?: User;
        tokenData?: TokenDataInterface;
        role?: RoleEnum;
        transaction?: Transaction;
    }): Promise<void> => {
        const { email } = body;

        // let users: ModuleIdLangMapResp;
        if (user) {
            await getModuleChildAndParent(User.name, user.id, transaction);
        }
        const checkUser = await this.get({
            where: {
                ...(user && { id: { [Op.notIn]: [user.id] } }),
                email,
            },
            rejectOnEmpty: false,
            attributes: ['id', 'email', 'username'],

            transaction,
        });

        if (checkUser) {
            throw new HttpException(400, 'USER_UNIQUE_EMAIL_ERROR');
        }
    };

    readonly updateUserData = async (user: User, data: UserAttributes) => {
        await User.update(data, { where: { id: user.id } });
    };

    readonly updateUser = async (userCreateArgs: Required<BuildUserArgs>) => {
        const { data, user, transaction, tokenData, files } = userCreateArgs;
        const oldEmail = user?.email;
        const oldUser = user;
        // set Data.
        let extra_data = null;
        let role_name = '';
        if (data.email) {
            await this.checkUserData({ body: data, user });
        }

        _.forEach(files || [], (file: Express.MulterS3.File) => {
            if (!data.profile_image && file.fieldname === FILE_FIELD_ENUMS.PROFILE_IMAGE) {
                data.profile_image = file.path;
            }
        });

        if (data.role) {
            let isRoleExists: Role;

            if (typeof data.role === 'string') {
                isRoleExists = await this.roleRepository.getRoleByName(data.role);
            } else {
                isRoleExists = await this.roleRepository.getRoleById(data.role);
                role_name = isRoleExists.name;
            }
            data.role_id = isRoleExists.id;
        }

        const full_name = `${data?.first_name} ${data?.last_name}`;

        const { moduleIdLangMap: userIdLangMap } = await getModuleDataTranslation(User.name, {
            data: { ...data, full_name },
            fields: ['first_name', 'last_name'],
            slugKeyModule: 'username',
            ...(data.first_name && data.last_name ? { slugKeyData: 'full_name' } : {}),
            transaction,
            user_id: tokenData.user.id,
            module_id: user.id,
            onlyDefaultLang: true,
            convert: false,
            tokenData,
        });
       
        const userData = await User.findOne({ where: { id: user.id, active: USER_STATUS.ACTIVE } });
        const adminUser = await User.findOne({
            where: { active: USER_STATUS.ACTIVE },
            include: [
                {
                    model: Role,
                    where: {
                        name: RoleEnum.ADMIN,
                    },
                },
            ],
        });
    
        let updatedUser = await this.getUser(user.id, transaction);
        updatedUser = { ...parse(updatedUser), ...extra_data };
        if ('is_head' in data) {
            await createLogMessage(
                { tokenData: tokenData },
                data.is_head === true ? json.USER_HEAD_UPDATE_SUCCESS : json.USER_HEAD_REMOVE_SUCCESS,
                FeaturesEnum.User,
                data.is_head === true ? 'User Head Updated' : 'User Head Removed',
                updatedUser.id,
                this.logRepo,
                { additionalMessageProps: { additionalMessageProps: updatedUser?.full_name, transaction } },
                PermissionEnum.Update,
            );
        } else if (!('first_name' in data)) {
            await createLogMessage(
                { tokenData: tokenData },
                data.active === 'ACTIVE' ? json.USER_STATUS_UPDATE_SUCCESS : json.USER_STATUS_REMOVE_SUCCESS,
                FeaturesEnum.User,
                data.active === 'ACTIVE' ? 'User Status Active' : 'User Status InActive',
                updatedUser.id,
                this.logRepo,
                { additionalMessageProps: { additionalMessageProps: updatedUser?.full_name, transaction } },
                PermissionEnum.Update,
            );
        } else {
            await createLogMessage(
                { tokenData: tokenData },
                json.USER_UPDATE_SUCCESS,
                FeaturesEnum.User,
                'User updated',
                updatedUser.id,
                this.logRepo,
                {
                    additionalMessageProps: {
                        additionalMessageProps: updatedUser?.full_name,
                        roleName: role_name === '' ? data.role : role_name,
                        transaction,
                    },
                    transaction,
                },
                PermissionEnum.Update,
            );
        }
        return updatedUser;
    };

    readonly addUser = async (userCreateArgs: BuildUserArgs): Promise<BuildUserResp> => {
        const { data, tokenData, transaction, shouldSentMail, files } = userCreateArgs;
        let isRoleExists: Role;

        if (!data.role) {
            throw new HttpException(404, 'NOT_FOUND');
        }
        if (typeof data.role === 'string') {
            isRoleExists = await this.roleRepository.getRoleByName(data.role);
        } else {
            isRoleExists = await this.roleRepository.getRoleById(data.role);
        }

        if (!isRoleExists) throw new HttpException(404, 'NOT_FOUND');
        if (isRoleExists.name === RoleEnum.ADMIN) throw new HttpException(400, 'INVALID');

        const password = generateRandomPassword(12);

        const { moduleIdLangMap: userIdLangMap } = await getModuleDataTranslation(User.name, {
            data: {
                ...data,
                password,
                active: USER_STATUS.ACTIVE,
                role_id: isRoleExists.id,
                full_name: `${data?.first_name} ${data?.last_name}`,
                added_by: tokenData?.user?.id,
            },
            fields: ['first_name', 'last_name', 'address1', 'address2', 'city', 'country', 'state'],
            slugKeyModule: 'username',
            slugKeyData: 'full_name',
            transaction,
            onlyDefaultLang: true,
            tokenData,
            convert: false,
        });

        switch (isRoleExists.id) {
            case 2:
                await this.trainingSpecialistRepository.createTrainingSpecialist({
                    tokenData,
                    transaction,
                    user: {
                        userIdLangMap,
                    },
                });
                break;
            case 3:
                await this.trainerRepository.createTrainerRepo({
                    data: {
                        hourly_rate: data.trainer.hourly_rate,
                        travel_reimbursement_fee: data.trainer.travel_reimbursement_fee,
                        location: data.trainer.location,
                        rate_by_admin: data?.trainer?.rate_by_admin,
                        trainer_attachment:
                            typeof data?.trainer_attachment === 'string'
                                ? [data?.trainer_attachment]
                                : data?.trainer_attachment?.length
                                    ? data?.trainer_attachment
                                    : [],
                    },
                    tokenData,
                    transaction,
                    user: {
                        userIdLangMap,
                    },
                    files: files,
                });
                break;
            case 6:
                await this.salesRepRepository.createSalesRep({
                    tokenData,
                    transaction,
                    user: {
                        userIdLangMap,
                    },
                });
                break;

            default:
                break;
        }
        const replacement = {
            username: `${data.first_name} ${data.last_name}`,
            password,
        };
        shouldSentMail && this.sendMailRepository.sendMailUserRegister(data, replacement);
        const allAdmins = await this.getAllUsersByRoleName(RoleEnum.Admin, ['id', 'email']);
        const adminsToSendNotification = allAdmins.filter((user) => user.id !== tokenData?.user?.id);
        const UserRole = parse(await this.roleRepository.get({ attributes: ['name'], where: { id: isRoleExists.id } }));
        adminsToSendNotification.map((user) => {
            this.notificationRepository.sendNotification(
                user.id,
                `New ${UserRole.name} : ${data?.first_name ?? ''} ${data?.last_name ?? ''} added successfully`,
                `User Created`,
                NotificationTypes.USER,
            );
            const role_name = UserRole.name;
            const first_name = user?.first_name ?? '';
            const last_name = user?.last_name ?? '';

            this.sendMailRepository.sendUserCreationMail([user.email], { role_name, first_name, last_name })

        });
        await createLogMessage(
            { tokenData: tokenData },
            tokenData !== undefined ? json.USER_ADD_SUCCESS : json.USER_REGISTER_ADD_SUCCESS,
            FeaturesEnum.User,
            'User created',
            userIdLangMap?.italian,
            this.logRepo,
            { additionalMessageProps: { additionalMessageProps: replacement?.username, roleName: UserRole.name } },
            PermissionEnum.Create,
        );
        return {
            userIdLangMap,
        };
    };

    readonly getData = async (where: UserAttributesType) => {
        const userData = await User.findOne({ where });
        if (!userData) throw new HttpException(409, 'NOT_FOUND', {}, true);
        else return userData;
    };

    static readonly getLoginUserData = (email: string) => {
        return (<ModelCtor<User>>db.models.User).findOne({
            where: { email: email },
            rejectOnEmpty: false,
        });
    };

    readonly deleteUser = async (req, query: DeleteArgsType<User>) => {
        const UserData = await User.findOne(query);
        await this.TrainerEditorRemove(UserData.id, req.transaction);
        await createLogMessage(
            req,
            json.USER_DELETE_SUCCESS,
            FeaturesEnum.User,
            'User deleted',
            UserData.id,
            this.logRepo,
            {
                additionalMessageProps: { additionalMessageProps: UserData?.full_name },
            },
            PermissionEnum.Delete,
        );
        return this.deleteData({
            ...query,
        });
    };

    readonly checkUserRole = async (role: RoleEnum, userId: number) => {
        const user = await this.get({
            where: {
                id: userId,
            },
            include: [
                {
                    model: Role,
                    as: 'role',
                },
            ],
        });

        return role === user.role.name;
    };

    readonly getUser = async (user_id: number, transaction: Transaction) => {
        return await this.get({
            where: {
                id: user_id,
            },
            attributes: [
                'full_name',
                'id',
                'email',
                'first_name',
                'last_name',
                'username',
                'contact',
                'profile_image',
                'added_by',
                'date_format',
                'timezone',
                'birth_date',
                'gender',
                'address1',
                'address2',
                'city',
                'country',
                'state',
                'zip',
                'active',
                'verified',
                'role_id',
                'language',
                'chat_user_status',
                'last_active_time',
            ],
            transaction,
        });
    };

    public async getAllUsersByRoleName(roleName: RoleEnum, attributes: string[]) {
        const roleDetails = parse(await this.roleRepository.getRoleByName(roleName));
        const data = parse(await this.getAll({ attributes, where: { role_id: roleDetails.id } }));
        return data;
    }

    readonly bulkAddUser = async (bulkUserArgs: BuildBulkUserArgs, is_migration?: boolean, removeDuplicateEmails?: boolean) => {
        const { data, tokenData, transaction, shouldSentMail, is_bulk_upload_mail } = bulkUserArgs;
        let duplicateEmails = [];
        if (removeDuplicateEmails) {
            duplicateEmails = findDuplicates(data.users.map((user) => user.email));

            data.users = data.users.filter((user) => !duplicateEmails.includes(user.email));
        }

        const existingUsers: User[] = await this.getAll({
            // attributes: ['email'],
            where: {
                email: { [Op.in]: data.users.map((user) => user.email) },
            },
        });

        const usersToInsert = data.users.filter(
            (user) => existingUsers.findIndex((existingUser) => user.email === existingUser.email) === -1,
        );
        let isRoleExists: Role;

        if (!data.role) {
            throw new HttpException(404, 'NOT_FOUND');
        }
        if (typeof data.role === 'string') {
            isRoleExists = await this.roleRepository.getRoleByName(data.role);
        } else {
            isRoleExists = await this.roleRepository.getRoleById(data.role);
        }

        if (!isRoleExists) throw new HttpException(404, 'NOT_FOUND');
        if (!data.is_admin_bulk_upload) {
            if (isRoleExists.name === RoleEnum.Admin) throw new HttpException(400, 'INVALID');
        }

        const normalizedUsers = bulkUserCreateNormalizer(usersToInsert);
        const emailPasswordMap: { [key: string]: string } = {};

        const language = await LanguageModel.findOne({
            where: {
                is_default: true,
            },
            order: [['is_default', 'DESC']],
            transaction,
        });

        const userInsertData = await Promise.all(
            usersToInsert.map(async (user) => {
                const userData = normalizedUsers[user.email].user;
                const password = user?.password ? user?.password : generateRandomPassword(12);
                emailPasswordMap[userData.email] = password;

                let username = await generateSlugifyForModel(
                    `${userData.first_name} ${userData?.last_name}`,
                    User,
                    'username',
                    false,
                    transaction,
                );
                let isUsernameAvailable;
                if (is_migration) {
                    isUsernameAvailable = await User.count({
                        where: {
                            username: user?.username,
                        },
                    });
                    if (user?.username && isUsernameAvailable <= 0) username = user?.username;
                }
                return {
                    ...userData,
                    password,
                    username: username,
                    active: USER_STATUS.ACTIVE,
                    role_id: isRoleExists.id,
                    added_by: tokenData?.user?.id,
                    language: language.name as LanguageEnum,
                };
            }),
        );

        if (!is_migration) {
            await Promise.all(
                existingUsers.map(async (existingUser) => {
                    const newUser = data.users.find((user) => user.email === existingUser.email);
                    if (newUser) {
                        const userDataChanged = JSON.stringify(existingUser) !== JSON.stringify(newUser);
                        if (userDataChanged) {
                            const normalizedUpdateUsers = bulkUserCreateNormalizer([newUser]);
                            const updateNormalizer = await this.updateBulkNormalizer(existingUser, normalizedUpdateUsers, transaction);
                            await User.update(updateNormalizer, { where: { id: existingUser.id }, transaction });

                            // Identify the user's role
                            switch (isRoleExists.name as RoleEnum) {
                                case RoleEnum.Trainer:
                                    const trainerData = normalizedUpdateUsers[existingUser.email].trainer;
                                    await this.updateTrainer({ ...trainerData, id: existingUser.id }, transaction);
                                    break;
                                case RoleEnum.CompanyManager:
                                    const managerData = normalizedUpdateUsers[existingUser.email].manager;
                                    await this.updateManagerData({ ...managerData, id: existingUser.id }, transaction);
                                    break;
                                case RoleEnum.PrivateIndividual:
                                    const privateIndividualData = normalizedUpdateUsers[existingUser.email].privateIndividual;
                                    await this.updatePrivateIndividualData({ ...privateIndividualData, id: existingUser.id }, transaction);
                                    break;
                            }
                        }
                    }
                }),
            );
        }

        const createdUsers = await this.bulkCreate(userInsertData, { ignoreDuplicates: false, transaction });
        for (const createdUser of createdUsers) {
            switch (isRoleExists.name as RoleEnum) {
                case RoleEnum.Trainer:
                    const trainerData = normalizedUsers[createdUser.email].trainer;
                    await this.trainerRepository.createTrainerRepo({
                        data: {
                            hourly_rate: trainerData?.hourly_rate,
                            travel_reimbursement_fee: trainerData?.travel_reimbursement_fee,
                            location: trainerData?.location,
                            rate_by_admin: trainerData?.rate_by_admin,
                            latitude: trainerData?.latitude,
                            longitude: trainerData?.longitude,
                        },
                        tokenData,
                        transaction,
                        user: {
                            userIdLangMap: { [language.name]: createdUser.id },
                        },
                        files: [],
                    });
                    break;
                case RoleEnum.CompanyManager:
                    const managerData = normalizedUsers[createdUser.email].manager;
                    const managerInstance = new ManagerRepo();
                    const managerResp = await managerInstance.createManagerRepo({
                        data: {
                            job_title: managerData?.job_title,
                        },
                        tokenData,
                        transaction,
                        user: {
                            userIdLangMap: { [language.name]: createdUser.id },
                        },
                    });

                    if (managerData.companies.length) {
                        await manageJunctionTableTranslation(Manager.name, Company.name, CompanyManager.name, {
                            primaryModuleId: Object.values(managerResp.managerIdLangMap)[0],
                            primaryModuleAssociationKey: 'manager_id',
                            secondaryModuleIds: [...managerData.companies],
                            secondayModuleAssociationKey: 'company_id',
                            transaction,
                            ...(tokenData?.user?.id ? { user_id: tokenData?.user?.id } : {}),
                            onlyDefaultLang: true,
                            tokenData,
                            convert: false,
                        });
                    }
                    break;
                case RoleEnum.PrivateIndividual:
                    const privateIndividualData = normalizedUsers[createdUser.email].privateIndividual;
                    const privateIndividualInstance = new PrivateIndividualRepo();
                    await privateIndividualInstance.createPrivateIndividualRepo({
                        data: {
                            job_title: privateIndividualData?.job_title,
                            codice_fiscale: privateIndividualData?.codice_fiscale,
                        },
                        transaction,
                        buildUserResp: {
                            userIdLangMap: { [language.name]: createdUser.id },
                        },
                    });
                    break;
                default:
                    break;
            }

            const replacement = {
                username: `${createdUser.first_name} ${createdUser.last_name}`,
                password: emailPasswordMap[createdUser.email],
            };
            if (shouldSentMail) {
                this.sendMailRepository.sendMailUserRegister(createdUser, replacement, is_bulk_upload_mail);
            }
        }
        this.sendUserCreationNotification(createdUsers, tokenData?.user, isRoleExists.id);

        const resp = [];

        if (duplicateEmails.length) {
            resp.push({ message: 'Duplicate emails found', data: duplicateEmails });
        }
        return resp;
    };

    readonly sendUserCreationNotification = async (users: User[], createdBy: User, roleId) => {
        for (const user of users) {
            const admins = await this.getAllUsersByRoleName(RoleEnum.Admin, ['id', 'email']);
            const adminsToSendNotification = admins.filter((admin) => admin.id !== createdBy.id);
            const UserRole = parse(await this.roleRepository.get({ attributes: ['name'], where: { id: roleId } }));
            for (const admin of adminsToSendNotification) {
                await this.notificationRepository.sendNotification(
                    admin.id,
                    `New ${UserRole.name} : ${user?.first_name ?? ''} ${admin?.last_name ?? ''} added successfully`,
                    `User Created`,
                    NotificationTypes.USER,
                );
                const role_name = UserRole.name;
                const first_name = user?.first_name ?? '';
                const last_name = user?.last_name ?? '';

                await this.sendMailRepository.sendUserCreationMail([admin.email], { role_name, first_name, last_name })
            }
        }
    };

    readonly updateBulkNormalizer = async (user, normalizedUpdateUsers, transaction) => {
        const userData = normalizedUpdateUsers[user.email].user;
        const username = await generateSlugifyForModel(
            `${userData.first_name} ${userData?.last_name}`,
            User,
            'username',
            false,
            transaction,
        );

        return {
            ...userData,
            username: username,
        };
    };

    readonly updateTrainer = async (existingUser, transaction) => {
        return await Trainer.update(
            {
                hourly_rate: existingUser.hourly_rate,
                travel_reimbursement_fee: existingUser.travel_reimbursement_fee,
                location: existingUser.location,
                rate_by_admin: existingUser?.rate_by_admin,
                latitude: existingUser.latitude,
                longitude: existingUser.longitude,
            },
            { where: { user_id: existingUser.id }, transaction },
        );
    };

    readonly updateManagerData = async (existingUser, transaction) => {
        return await Manager.update(
            {
                job_title: existingUser.job_title,
            },
            { where: { user_id: existingUser.id }, transaction },
        );
    };

    readonly updatePrivateIndividualData = async (existingUser, transaction) => {
        return await PrivateIndividual.update(
            {
                job_title: existingUser?.job_title,
                codice_fiscale: existingUser?.codice_fiscale,
            },
            { where: { user_id: existingUser.id }, transaction },
        );
    };
}
