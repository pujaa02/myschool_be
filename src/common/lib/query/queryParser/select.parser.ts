import { Request } from 'express';
import _ from 'lodash';
import { ProjectionAlias } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';
import { SelectArgs } from './query.parser.interface';

export class SelectParser<M extends Model> {
  readonly req: Partial<Request>;
  readonly model: ModelCtor<M>;

  constructor({ req, model }: SelectArgs<M>) {
    this.req = req;
    this.model = model;
  }

  readonly getAttributesQuery = () => {
    const attributes: (string | ProjectionAlias)[] = this.getSelectQuery() || [];
    return attributes;
  };

  // NEED TO IMPROVE
  private readonly getSelectQuery = () => {
    if (!this.req.query?.select) {
      return Object.keys(this.model?.getAttributes());
    }

    if (this.req.query?.select === 'notAll') {
      return [];
    }

    if (this.req.query?.select && typeof this.req.query?.select === 'string') {
      // Unique Columns.
      return _.chain(this.req.query?.select.split(',') || [])
        .uniq()
        .compact()
        .value();
    }
    return [];
  };
}
