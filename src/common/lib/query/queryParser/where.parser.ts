import { Op, literal, where } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';

export const allowedConditions = [
  'gt',
  'gte',
  'lt',
  'lte',
  'ne',
  'eq',
  'like',
  'notLike',
  'iEq',
  'startsWith',
  'endsWith',
  'contains',
  'iLike',
  'notILike',
  'regexp',
  'notRegexp',
  'iRegexp',
  'notIRegexp',
];
export const allowedConditionsArray = ['between', 'notBetween', 'in', 'notIn'];
export const conditionsParams = ['or', 'and', 'not'];

export const OperatorMapper = {
  iEq: Op.iLike,
};

export interface WhereArgs<M extends Model> {
  readonly request: Record<string, any>;
  readonly model: ModelCtor<M>;
}

export default class WhereParser<M extends Model> {
  readonly request: Record<string, any>;
  readonly model: ModelCtor<M>;

  fields: Set<string> = new Set();

  constructor(data: WhereArgs<M>) {
    this.request = data.request;
    this.model = data.model;
  }

  // getQuery Method
  readonly getQuery = () => {
    return { whereQuery: this._getQuery(this.request), whereFields: [...this.fields] };
  };

  private readonly _getQuery = (filterObj: Record<string, any>, query: Record<string | symbol, any> = {}) => {
    Object.keys(filterObj || {}).forEach((key) => {
      const fieldValue = filterObj[key];
      const fieldKey = this.getFieldKey(key);

      // 1. check and/or query.
      if (conditionsParams.includes(fieldKey)) {
        Object.assign(query, { [Op[fieldKey]]: this._getConditionalQuery(fieldValue) });
        // 2. check operator query.( Like, iLike, between, etc. )
      } else if (allowedConditions.includes(key) || allowedConditionsArray.includes(key)) {
        Object.assign(query, { [Op[key] || OperatorMapper[key]]: this._getValue(key, fieldValue) });
        // 3. check normal eq query.
      } else if (typeof fieldValue !== 'object' || key === 'eq') {
        // Query
        Object.assign(query, { [Op[key] || OperatorMapper[key] || fieldKey]: this._getValue(key, fieldValue) });
        // 4. check for nested query.(mostly For and/or).
      } else if (typeof fieldValue === 'object') {
        Object.assign(query, this.getObjectQuery(fieldKey, fieldValue));
      } else {
        //
      }
    });
    return query;
  };

  private readonly getFieldType = (fieldKey: string) => {
    return this.model.getAttributes()[fieldKey]?.type?.constructor?.name;
  };

  private readonly getObjectQuery = (fieldKey: string, fieldValue: Record<string, any>) => {
    const fieldType = this.getFieldType(fieldKey);

    if (fieldType) {
      switch (fieldType) {
        case 'JSON':
        case 'JSONB':
          return this.getJSONQuery(fieldKey, fieldValue);
        case 'ARRAY':
          return this.getArrayFilterQuery(fieldKey, fieldValue);
        default:
          return { [fieldKey]: this._getQuery(fieldValue) };
      }
    } else {
      return { [fieldKey]: this._getQuery(fieldValue) };
    }
  };

  private readonly getJSONQuery = (fieldKey: string, fieldValue: Record<string, any>) => {
    let jsonFilter = {};
    const firstKey = Object.keys(fieldValue)?.at(0);
    switch (firstKey) {
      case 'iLike':
      case 'notILike':
        jsonFilter = [where(literal(`${fieldKey}::text`), Op[firstKey], `%${fieldValue[firstKey]}%`)];
        break;
      case 'startsWith':
        jsonFilter = [where(literal(`${fieldKey}::text`), Op.iLike, `%"value": "${fieldValue[firstKey]}%`)];
        break;
      case 'endsWith':
        jsonFilter = [where(literal(`${fieldKey}::text`), Op.iLike, `%"value": "%${fieldValue[firstKey]}",%`)];
        break;
      default:
        jsonFilter = { [fieldKey]: this._getQuery(fieldValue) };
        break;
    }
    return jsonFilter;
  };

  private readonly getArrayFilterQuery = (fieldKey: string, fieldValue: Record<string, any>) => {
    let arrFilter = {};
    const firstKey = Object.keys(fieldValue)?.at(0);
    switch (firstKey) {
      case 'iLike':
      case 'notILike':
        arrFilter = [where(literal(`${fieldKey}::text`), Op[firstKey], `%${fieldValue[firstKey]}%`)];
        break;
      case 'contains':
      case 'eq':
        arrFilter = { [fieldKey]: { [Op.contains]: [fieldValue[firstKey]] } };
        break;
      case 'like':
        arrFilter = { [fieldKey]: { [Op.like]: [fieldValue[firstKey]] } };
        break;
      case 'ne':
        arrFilter = { [Op.not]: { [fieldKey]: { [Op.contains]: [fieldValue[firstKey]] } } };
        break;
      case 'startsWith':
        arrFilter = [literal(`jsonb_path_exists(to_jsonb(${fieldKey}), '$[*] ? (@ like_regex "^${fieldValue[firstKey]}")')`)];
        break;
      case 'endsWith':
        arrFilter = [literal(`jsonb_path_exists(to_jsonb(${fieldKey}), '$[*] ? (@ like_regex "${fieldValue[firstKey]}$")')`)];
        break;
      default:
        arrFilter = { [fieldKey]: this._getQuery(fieldValue) };
        break;
    }
    return arrFilter;
  };

  private readonly getTypedValues = (type: string, value: string) => {
    if (type === 'n') {
      return (value || '').split(',').map((val) => +val);
    } else {
      return (type || '').split(',');
    }
  };

  // gives value
  private readonly _getValue = (key: string, value: string) => {
    if (value === '') {
      return null;
    }

    if (key === 'iLike' || key === 'notILike') {
      value = `%${value}%`;
      return value;
    }

    if (allowedConditionsArray.includes(key) && typeof value === 'string') {
      const [type, values] = value.split('|');
      const condValues = value === '' ? [null] : this.getTypedValues(type, values);
      return condValues;
    } else if (typeof value === 'string' && value?.split?.('|')?.length > 1) {
      const splitValue = value?.split('|');
      return this.convertValue(splitValue[0], splitValue[1]);
    } else {
      //
    }

    return this.getDbTypedValue(key, value);
  };

  private readonly getDbTypedValue = (key: string, value: string) => {
    const fieldType = this.getFieldType(key);

    if (fieldType && value) {
      switch (fieldType) {
        case 'INTEGER':
          return parseInt(value, 10);
        case 'FLOAT':
          return parseFloat(value);
        case 'DATE':
          return new Date(value);
        default:
          return value;
      }
    }

    return value;
  };

  private readonly convertValue = (key: string, value: string) => {
    switch (key) {
      case 'n':
        return parseInt(value, 10);
      case 'f':
        return parseFloat(value);
      case 'b':
        return value === 'true' ? true : false;
      case 'd':
        return new Date(value);
      default:
        return value;
    }
  };

  readonly getFieldKey = (key: string) => {
    let result = key;
    if (key.indexOf('.') !== -1) {
      result = `$${key}$`;
    }

    return result;
  };

  // check conditional Data.
  private readonly _getConditionalQuery = (value: Object) => {
    if (Array.isArray(value)) {
      return [].concat(value.map((_v) => this._getQuery(_v)));
    } else if (typeof value === 'object') {
      return [].concat(this._getQuery(value));
    } else {
      return [];
    }
  };
}
