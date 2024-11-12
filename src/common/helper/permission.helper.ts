
  import _ from 'lodash';
  import { Request } from 'express';
  import { status } from '@/models/interfaces/user.model.interface';
import { BasePermissionGroups, OtherPermissionGroups, PermissionTypes, TagPermissions } from '../constants/permissionGroup.constants';
  
  export interface IVerifyPermissionArgs {
    req: Request;
    module: BasePermissionGroups | OtherPermissionGroups;
    type: PermissionTypes | TagPermissions;
    fromReqParams?: 'body' | 'params' | 'query' | '';
  }
  
  export async function verifyPermission(checkPermissionArgs: IVerifyPermissionArgs) {
    const { module, req, type, fromReqParams } = checkPermissionArgs;
    const uuid = `${req.headers.xorganization || ''}`;
    let hasModulePermission = false;
    let moduleCloned = _.clone(module);
    let permissionType = _.clone(type);
    const isSelf =
      moduleCloned === BasePermissionGroups.USER &&
    //   (req.params && +req.params.id) === id &&
      (permissionType === PermissionTypes.UPDATE || permissionType === PermissionTypes.READ);
  
  
  
    if (moduleCloned === BasePermissionGroups.LEAD) {
      const isDeal = (req?.query?.q as Record<string, any>)?.is_deal;
      const isDealString = typeof isDeal === 'string' ? isDeal === 'true' : !!isDeal;
      moduleCloned = req?.body?.is_deal || isDealString
        ? BasePermissionGroups.DEAL
        : BasePermissionGroups.LEAD;
    }
  
    permissionType =
      fromReqParams && _.get(req?.[fromReqParams], type, '') ? _.get(req?.[fromReqParams], type, '') : type;
  
    return  hasModulePermission || isSelf ? true : false;
  }
  