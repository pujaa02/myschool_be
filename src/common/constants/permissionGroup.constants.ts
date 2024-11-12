export enum BasePermissionGroups {
    LEAD = 'leads',
    CONTACT = 'contacts',
    DEAL = 'deals',
    ACCOUNT = 'accounts',
    USER = 'users',
    ORGANIZATION = 'organizations',
    PROFILE_AND_PERMISSION = 'profile and permissions',
    NOTE = 'notes',
    ATTACHMENT = 'attachments',
    DEPARTMENT = 'departments',
    ACTIVITY = 'activities',
  }
  
  export enum OtherPermissionGroups {
    TAG = 'tags',
  }
  
  export enum PermissionTypes {
    CREATE = 'create',
    UPDATE = 'update',
    READ = 'read',
    DELETE = 'delete',
  }
  
  export enum TagPermissions {
    CREATE = 'create',
    UPDATE = 'update',
    READ = 'read',
    DELETE = 'delete',
    LEAD = 'leads',
    CONTACT = 'contacts',
    ACCOUNT = 'accounts',
    DEAL = 'deals',
    ACTIVITY = 'activities',
  }
  
  export enum AttachmentPermissions {
    CREATE = 'create',
    READ = 'read',
    DELETE = 'delete',
  }
  
  // this var for which module show in profile permission page in frontend side
  export const CLIENT_SIDE_SEND_PERMISSIONS = {
    TAG: ['accounts', 'deals', 'leads', 'contacts', 'activities'],
  };
  
  export enum AllPermissionTypes {
    CREATE = 'create',
    UPDATE = 'update',
    READ = 'read',
    DELETE = 'delete',
    LEAD = 'leads',
    CONTACT = 'contacts',
    ACCOUNT = 'accounts',
    DEAL = 'deals',
    ACTIVITY = 'activities',
  }
  