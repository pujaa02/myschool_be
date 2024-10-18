export enum PermissionEnum {
  Update = 'Update',
  Delete = 'Delete',
  Create = 'Create',
  View = 'View',
}

export enum RoleEnum {
  ADMIN = 'Admin',
  TEACHER = 'Teacher',
  STUDENT = 'Student',
}
export enum FeaturesEnum {
  Dashboard = 'Dashboard',
  User = 'User',
  Feature = 'Feature',
  Role = 'Role',
  Permissions = 'Permission',
  RolePermission = 'RolePermission',
  Admin = 'Admin',
  Teacher = 'Teacher',
  Student = 'Student',
  Class = 'Class',
  Exam = 'Exam',
  Sensation = 'Sensation',
  Leave = 'Leave',
  Committe = 'Committe',
  SystemLog = 'SystemLog',
}

export enum language {
  en = 'english',
}

export const queryBuildCases = {
  default: 'default',
  getAllRoleWiseData: 'getAllRoleWiseData',
  getFeatureDropdown: 'getFeatureDropdown',
};
