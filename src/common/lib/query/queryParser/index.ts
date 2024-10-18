import { Request } from 'express';
import _ from 'lodash';
import { Op, OrderItem } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';
import IncludeParser from './include.parser';
import OrderParser from './order.parser';
import { ParsedQuery, QueryParserArgs } from './query.parser.interface';
import SearchParser from './search.parser';
import { SelectParser } from './select.parser';
import WhereParser from './where.parser';

export class QueryParser<M extends Model> {
  whereFields: string[];
  readonly req: Partial<Request>;
  readonly model: ModelCtor<M>;
  readonly isGroupBy?: boolean;

  constructor({ request, model, isGroupBy }: QueryParserArgs<M>) {
    this.req = request;
    this.model = model;
    this.isGroupBy = isGroupBy;
  }

  readonly getFullQuery = (target: Record<string, any> = {}): ParsedQuery => {
    return Object.assign({}, target, {
      where: this.getWhereQuery(),
      order: this.getOrderQuery(),
      limit: this.getLimitQuery(),
      offset: this.getOffsetQuery(),
      include: this.getIncludeQuery(),
      attributes: this.getAttributesQuery(),
      subQuery: this.getSubQuery(),
      paranoid: this.getParanoid(),
      whereFields: this.whereFields,
    });
  };

  readonly getAttributesQuery = () => {
    return new SelectParser({
      req: this.req,
      model: this.model,
    })?.getAttributesQuery();
  };

  private getSubQuery = () => {
    const subQuery = _.get(this.req.query, 'subQuery', 'true') as string | boolean;

    if (subQuery && typeof subQuery === 'string') {
      return subQuery === 'false' ? false : undefined;
    }

    return !!subQuery;
  };

  private getParanoid = () => {
    const paranoid = _.get(this.req.query, 'paranoid', 'true') as string | boolean;

    if (paranoid && typeof paranoid === 'string') {
      return paranoid === 'false' ? false : undefined;
    }

    return !!paranoid;
  };

  private readonly getWhereQuery = () => {
    const whereBuildData = new WhereParser({
      request: this.req.query?.q as Record<string | symbol, any>,
      model: this.model,
    })?.getQuery();

    // Where Query
    const whereQuery = whereBuildData?.whereQuery;
    this.whereFields = whereBuildData.whereFields;

    // Search OR Query.
    const searchQuery = new SearchParser({ model: this.model, request: this.req }).getQuery();

    if (whereQuery?.[Op.or]?.length || searchQuery?.[Op.or]?.length) {
      whereQuery[Op.or] = _.concat(whereQuery?.[Op.or] || [], searchQuery?.[Op.or] || []);
    }
    return whereQuery;
  };

  private readonly getOrderQuery = (): OrderItem[] => {
    if (typeof this.req.query?.sort === 'string' && this.req.query?.sort) {
      return new OrderParser(this.req.query.sort)?.getQuery() as any;
    }

    return [['id', 'DESC']];
  };

  private readonly getLimitQuery = () => {
    return +_.get(this.req.query, 'limit', 10);
  };

  private readonly getIncludeQuery = () => {
    return new IncludeParser({ req: this.req, model: this.model, isGroupBy: this.isGroupBy })?.getQuery();
  };

  private readonly getOffsetQuery = () => {
    const page = +_.get(this.req.query, 'page', 1);
    const limit = +_.get(this.req.query, 'limit', 10);
    return limit * (page - 1);
  };
}
