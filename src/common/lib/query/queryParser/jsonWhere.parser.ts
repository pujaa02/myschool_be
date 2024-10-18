import { Op, literal, where } from 'sequelize';
import { conditionsParams } from './where.parser';

const excludeKeyword = ['value', 'isPrimary', 'phoneType'];

export default class JsonWhereParser {
  //Generate Query
  readonly generateCustomJsonQuery = (jsonQuery, tableName) => {
    const newQuery = [];
    let customOperator = 'and';
    Object.keys(jsonQuery || {}).forEach((key) => {
      const fieldValue = jsonQuery[key];
      const fieldKey = key;
      if (conditionsParams.includes(fieldKey)) {
        //multiple Query
        customOperator = fieldKey;
        if (Array.isArray(fieldValue)) {
          Object.keys(fieldValue || {}).forEach((keyi) => {
            const fieldValuei = fieldValue[keyi];
            Object.keys(fieldValuei || {}).forEach((keyii) => {
              const fieldValueif = fieldValuei[keyii];
              const queryData = this.customWhereCondition(fieldValueif, keyii, tableName);
              if (queryData.length === 3) {
                newQuery.push(where(literal(queryData[0]), queryData[1], queryData[2]));
              }
            });
          });
        }
      } else {
        //Single Query
        const queryData = this.customWhereCondition(fieldValue, fieldKey, tableName);
        if (queryData.length === 3) {
          newQuery.push(where(literal(queryData[0]), queryData[1], queryData[2]));
        }
      }
    });
    return { customOperator, newQuery };
  };

  //JSON Where condition
  readonly customWhereCondition = (fieldValue: Object, colName: string, tableName: string) => {
    const keys = Object.entries(fieldValue);
    const typeChecking = keys[0][0];
    const valueCompare = keys[0][1];
    let CustomQuery = [];
    if (excludeKeyword.includes(valueCompare)) {
      return CustomQuery;
    }
    switch (typeChecking) {
      case 'iLike':
        CustomQuery = [`"${tableName}"."${colName}"::TEXT`, Op.iLike, `%${valueCompare}%`];
        break;
      case 'notILike':
        CustomQuery = [`not"${tableName}"."${colName}"::TEXT`, Op.iLike, `%${valueCompare}%`];
        break;
      case 'equals':
        CustomQuery = [`"${tableName}"."${colName}"`, '@>', `[{"value": "${valueCompare}"}]`];
        break;
      case 'notequal':
        CustomQuery = [`not"${tableName}"."${colName}"`, '@>', `[{"value": "${valueCompare}"}]`];
        break;
      case 'startsWith':
        CustomQuery = [`"${tableName}"."${colName}"::TEXT`, Op.iLike, `%"value": "${valueCompare}%`];
        break;
      case 'endsWith':
        CustomQuery = [`"${tableName}"."${colName}"::TEXT`, Op.iLike, `%"value": "%${valueCompare}",%`];
        break;
      default:
        break;
    }
    return CustomQuery;
  };
}
