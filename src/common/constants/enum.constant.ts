export enum PermissionEnum {
  Update = 'Update',
  Delete = 'Delete',
  Create = 'Create',
  View = 'View',
}

export enum RoleEnum {
  Admin = 'Admin',
  Teacher = 'Teacher',
  Student = 'Student',
}
export enum FeaturesEnum {
  Dashboard = 'Dashboard',
  Feature = 'Feature',
  Role = 'Role',
  Permissions = 'Permission',
  RolePermission = 'RolePermission',
  User = 'User',
  Admin = 'Admin',
  Teacher = 'Teacher',
  Student = 'Student',
  Class = 'Class',
  Exam = 'Exam',
  Sensation = 'Sensation',
  Leave = 'Leave',
  Committee = 'Committee',
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

export enum Super {
  FIRST_NAME = 'MySchool',
  LAST_NAME = 'Admin',
  EMAIL = 'myschool@gmail.com',
  PASSWORD = 'MySchool@12345',
  USERNAME = 'mySchool@admin',
}
