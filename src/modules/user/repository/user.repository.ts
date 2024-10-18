import { RoleEnum } from '@/common/constants/enum.constant';
import { HttpException } from '@/common/helper/response/httpException';
import { getModuleChildAndParent } from '@/common/helper/translation';
import { DeleteArgsType } from '@/common/interfaces/general/database.interface';
import { LanguageEnum } from '@/common/interfaces/general/general.interface';
import { generateRandomPassword, findDuplicates, generateSlugifyForModel, parse } from '@/common/util';
import db from '@/models';
import { Request } from 'express';
import { USER_STATUS, UserAttributes } from '@/models/interfaces/user.model.interface';
import LanguageModel from '@/models/language.model';
import Role from '@/models/role.model';
import User from '@/models/user.model';
import { TokenDataInterface } from '@/modules/auth/interfaces/auth.interfaces';
import BaseRepository from '@/modules/common/base.repository';
import RoleRepo from '@/modules/role/repository/role.repository';
import _ from 'lodash';
import { Transaction, Op, ModelCtor } from 'sequelize';
import { BuildUserArgs, BuildUserResp, BuildBulkUserArgs } from '../interfaces/user.interfaces';
import { bulkUserCreateNormalizer } from '../normalizer/user-bulk-create.normalizer';
import { FILE_FIELD_ENUMS } from '@/common/constants/multer.constant';

export default class UserRepo extends BaseRepository<User> {
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
    // set Data.
    let extra_data = null;
    let role_name = '';
    if (data.email) {
      await this.checkUserData({ body: data, user });
    }

    _.forEach(files || [], (file: Express.Multer.File) => {
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

    let updatedUser: any = await this.getUser(user.id, transaction);
    updatedUser = { ...parse(updatedUser), ...extra_data };
    return updatedUser;
  };

  readonly addUser = async (userCreateArgs: BuildUserArgs): Promise<BuildUserResp> => {
    const { data, tokenData, transaction } = userCreateArgs;
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
    if (isRoleExists.name === RoleEnum.Admin) throw new HttpException(400, 'INVALID');

    const password = generateRandomPassword(12);

    const userdata = await this.create({
      ...data,
      password,
      active: USER_STATUS.ACTIVE,
      role_id: isRoleExists.id,
      full_name: `${data?.first_name} ${data?.last_name}`,
      added_by: tokenData?.user?.id,
    });

    return {
      userdata,
    };
  };

  readonly getData = async (where: UserAttributes) => {
    const userData = await User.findOne({});
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

  readonly bulkAddUser = async (
    bulkUserArgs: BuildBulkUserArgs,
    is_migration?: boolean,
    removeDuplicateEmails?: boolean,
  ) => {
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
              const updateNormalizer = await this.updateBulkNormalizer(
                existingUser,
                normalizedUpdateUsers,
                transaction,
              );
              await User.update(updateNormalizer, { where: { id: existingUser.id }, transaction });
            }
          }
        }),
      );
    }

    const createdUsers = await this.bulkCreate(userInsertData, { ignoreDuplicates: false, transaction });
    for (const createdUser of createdUsers) {
      const replacement = {
        username: `${createdUser.first_name} ${createdUser.last_name}`,
        password: emailPasswordMap[createdUser.email],
      };
    }

    const resp = [];

    if (duplicateEmails.length) {
      resp.push({ message: 'Duplicate emails found', data: duplicateEmails });
    }
    return resp;
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
}
