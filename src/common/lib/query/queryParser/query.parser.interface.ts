import BaseRepository from '@/modules/common/base.repository';
import { Request } from 'express';
import QueryString from 'qs';
import { OrderItem, ProjectionAlias } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';

// ========== Used In Query Parser ==========================

export type ParsedQuery = Record<string, any> & {
  where: Record<string | symbol, any>;
  order: OrderItem[];
  limit: number;
  offset: number;
  include: any[];
  attributes: (string | ProjectionAlias)[];
  subQuery: boolean;
  paranoid: boolean;
  
  whereFields: string[];
};

export interface QueryParserArgs<M extends Model> {
  readonly request: Partial<Request>;
  readonly model: ModelCtor<M>;
  readonly isGroupBy?: boolean;
}

// ========== Used In Query Parser ==========================

export interface SelectArgs<M extends Model> {
  readonly req: Partial<Request>;
  readonly model: ModelCtor<M>;
}

export interface IAdvanceFilterData {
  clonedQuery: QueryString.ParsedQs;
  tokenData: any;
}

export interface IBelongsToRelationData {
  clonedQuery: QueryString.ParsedQs;
}

export interface IAdvanceRowsQueryData<M extends Model> {
  cteParsedQuery: ParsedQuery;
  clonedQuery: QueryString.ParsedQs;
  jsonParsedQuery?: { customOperator?: string; newQuery?: any[] };
  cteRepository: typeof BaseRepository<M>;
  organization_id: number;
  modelFindAllQuery: string;
  selectedCols: (string | ProjectionAlias)[];
}

export interface IGetCteQuery {
  clonedQuery: Request['query'];
  tokenData: any;
  isGroupBy?: boolean;
}

export interface IGetAdvancedAttributes<M extends Model> extends IGetCteQuery {
  whereFields: string[];
  model: ModelCtor<M>;
}

export interface IGroupColsData {
  id: string;
  displayName: string;
  field: string;
  [key: string]: any;
}

export interface IGroupValues {
  id: string;
  value: string;
  [key: string]: any;
}
