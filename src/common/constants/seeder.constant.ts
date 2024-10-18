import { userUsernameParamSchema } from './../../modules/user/validationSchema/user.validation';
import { RoleEnum, FeaturesEnum, PermissionEnum } from './enum.constant';

export const rolePermissionData = [
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Dashboard,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Feature,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Permissions,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Role,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.RolePermission,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.User,
    access: `${RoleEnum.Admin},${RoleEnum.Teacher},${RoleEnum.Student}`,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Admin,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Teacher,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Student,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Class,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Exam,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Sensation,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Leave,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.Committee,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Admin,
    featureName: FeaturesEnum.SystemLog,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Teacher,
    featureName: FeaturesEnum.Dashboard,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },

  {
    role: RoleEnum.Teacher,
    featureName: FeaturesEnum.Class,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Teacher,
    featureName: FeaturesEnum.Exam,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Teacher,
    featureName: FeaturesEnum.Sensation,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Teacher,
    featureName: FeaturesEnum.Leave,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Teacher,
    featureName: FeaturesEnum.Committee,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.Teacher,
    featureName: FeaturesEnum.SystemLog,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.Student,
    featureName: FeaturesEnum.Dashboard,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Student,
    featureName: FeaturesEnum.Class,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.Student,
    featureName: FeaturesEnum.Exam,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.Student,
    featureName: FeaturesEnum.Sensation,
    permission: [PermissionEnum.Create, PermissionEnum.Update, PermissionEnum.Delete, PermissionEnum.View],
  },
  {
    role: RoleEnum.Student,
    featureName: FeaturesEnum.Leave,
    permission: [PermissionEnum.Create, PermissionEnum.View],
  },
  {
    role: RoleEnum.Student,
    featureName: FeaturesEnum.Committee,
    permission: [PermissionEnum.View],
  },
  {
    role: RoleEnum.Student,
    featureName: FeaturesEnum.SystemLog,
    permission: [PermissionEnum.View],
  },
];
