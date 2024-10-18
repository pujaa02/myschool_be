import OrderParser from '@/common/lib/query/queryParser/order.parser';
import { SelectParser } from '@/common/lib/query/queryParser/select.parser';
import { GetIncludeQuery, IncludeAttribute } from '@/common/lib/query/queryParser/types';
import WhereParser from '@/common/lib/query/queryParser/where.parser';
import { Request } from 'express';
import _ from 'lodash';
import { Model, ModelCtor } from 'sequelize-typescript';

export default class IncludeParser<M extends Model> {
  readonly model: ModelCtor<M>;
  readonly req: Partial<Request>;
  readonly organization_id: number;
  readonly isGroupBy: boolean;

  constructor(data: GetIncludeQuery<M>) {
    this.model = data.model;
    this.req = data.req;
    this.isGroupBy = !!data.isGroupBy;
  }

  readonly getAssociatedModel = <N extends Model>(key: string, model: ModelCtor<N>) => {
    const db = require('@sequelizeDir/models')?.default;
    const modelName = model?.associations?.[key]?.target?.name;
    if (modelName) {
      return db.models?.[modelName];
    }
    return null;
  };

  readonly getQuery = () => {
    const a = this._getIncludeQuery({
      model: this.model,
      input: this.req.query.include as Record<string, any>,
    });

    return a;
  };

  private readonly getIncludeSelect = (value: string | { select?: string }, model: ModelCtor<Model<any, any>>) => {
    return new SelectParser({
      req: { query: { select: value } },
      model,
    })?.getAttributesQuery();
  };

  private readonly checkBoolean = (value: string | boolean) => {
    if (value && typeof value === 'string') {
      return value === 'true';
    }

    return value;
  };

  private readonly getSortQuery = (value: IncludeAttribute) => {
    if (value?.sort && typeof value.sort === 'string') {
      return new OrderParser(value?.sort).getQuery();
    }
    return null;
  };

  private readonly getOffsetQuery = (value: IncludeAttribute) => {
    if (value?.page && value?.limit) {
      const page = +_.get(value, 'page', 1);
      const limit = +_.get(value, 'limit', 10);
      return limit * (page - 1);
    }
    return null;
  };

  private readonly getLimitQuery = (value: IncludeAttribute) => {
    if (value?.page && value?.limit) {
      return +_.get(value, 'limit', 10);
    }
    return null;
  };

  readonly _getIncludeQuery = (includeQuery: Omit<GetIncludeQuery<M>, 'req'> & { input?: Record<string, any> }) => {
    const { input, model } = includeQuery;
    const result = [];
    _.forEach(input, (value, key) => {
      let includeObj: Record<string, any> = {};
      let includeModel = this.getAssociatedModel(key, model);
      if (includeModel) {
        if (includeModel?.options?.scopes?.['defaultOrganization']) {
          includeModel = includeModel?.scope?.({ method: ['defaultOrganization', this.organization_id] });
        }

        let includeAttributes;

        if (!this.isGroupBy) {
          includeAttributes = value !== 'all' ? this.getIncludeSelect(value, includeModel as ModelCtor<M>) : undefined;
        } else {
          includeAttributes = [];
        }

        if (typeof value === 'string') {
          includeObj = {
            model: includeModel,
            as: key,
            required: false,
            attributes: includeAttributes,
          };
        }

        if (typeof value !== 'string') {
          const whereClause =
            value?.q && new WhereParser({ request: value?.q, model: includeModel as ModelCtor<M> })?.getQuery()?.whereQuery;

          includeObj = {
            as: key,
            model: includeModel,
            required: this.checkBoolean(value?.required) || false,
            separate: this.checkBoolean(value?.separate) || false,
            paranoid: this.checkBoolean(value?.paranoid) !== false,
            where: whereClause,
            order: this.getSortQuery(value),
            limit: value.limit ? value.limit : this.getLimitQuery(value),
            offset: this.getOffsetQuery(value),
            attributes: !this.isGroupBy ? value?.select && this.getIncludeSelect(value.select, includeModel as ModelCtor<M>) : [],
          };
          if (value.include) {
            includeObj.include = this._getIncludeQuery({ input: value.include, model: includeModel as ModelCtor<M> });
          }
        }
        result.push(includeObj);
      }
    });

    return result;
  };
}
