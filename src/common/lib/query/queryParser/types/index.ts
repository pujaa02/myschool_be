import { Request } from 'express';
import { Model, ModelCtor } from 'sequelize-typescript';

export type IncludeAttribute = {
  required?: boolean;
  separate?: boolean;
  paranoid?: boolean;
  select?: string;
  sort?: string;
  page?: number;
  limit?: number;
  q?: Record<string, any>;
  as?: string;
};

export type IncludeParams = {
  [key: string]: string | (IncludeAttribute & { include?: IncludeParams });
};

export type GetIncludeQuery<M extends Model> = {
  req: Partial<Request>;
  model: ModelCtor<M>;
  isGroupBy?: boolean;
};

export enum ModuleNames {
  LEAD = 'leads',
  CONTACT = 'contacts',
  DEAL = 'deals',
  ACCOUNT = 'accounts',
  USER = 'users',
  PROFILE_AND_PERMISSION = 'profile and permissions',
  ORGANIZATION = 'organizations',
  TAG = 'tags',
  NOTE = 'notes',
  ATTACHMENT = 'attachments',
  DEPARTMENT = 'departments',
  CALENDAR = 'calendar',
  ACTIVITY = 'activities',
}

export type ColumnDetailData = {
  readonly displayName: string;
  readonly fieldName: string;
  readonly type: string;
  readonly fieldType: 'column' | 'association';
  readonly show?: boolean;
  readonly custom?: boolean;
  readonly default?: boolean;
  readonly width?: number;
  readonly min_width?: number;
  readonly is_pin?: boolean;
  readonly relational_model?: ModuleNames;
  readonly includeObj?: Record<string, any>;
  readonly searchKeys?: string[];
  readonly foreignKey?: string;
};
