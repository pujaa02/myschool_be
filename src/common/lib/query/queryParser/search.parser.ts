// import { queryBuildCases } from '@/common/constants/enum.constants';
// import { QueryParserArgs } from '@/common/lib/query/queryParser/query.parser.interface';
// import { Request } from 'express';
// import _ from 'lodash';
// import { Op, literal, where } from 'sequelize';
// import { Model, ModelCtor } from 'sequelize-typescript';

// export default class SearchParser<M extends Model> {
//   readonly req: Partial<Request>;
//   readonly model: ModelCtor<M>;
//   constructor({ request, model }: QueryParserArgs<M>) {
//     this.req = request;
//     this.model = model;
//   }

//   private readonly _getQuery = (searchText: string, searchFields: string[]) => {
//     const query = { [Op.or as symbol]: [] };
//     if (this.req?.query?.search && this.req.query.cases === queryBuildCases.getAllOrder) {
//       query[Op.or].push({ '$company.name$': { [Op.like]: `%${searchText}%` } });
//       query[Op.or].push({ '$quotes.quote_number$': { [Op.like]: `%${searchText}%` } });
//       query[Op.or].push({ $order_number$: { [Op.like]: `%${searchText}%` } });
//     }
//     if (this.req?.query?.search && this.req.query.cases === queryBuildCases.getCompanyWiseQuotes) {
//       // query[Op.or].push({ '$company.name$': { [Op.like]: `%${searchText}%` } });
//       query[Op.or].push({ '$Quotes.quote_number$': { [Op.like]: `%${searchText}%` } });
//     }
//     if (this.req?.query?.search && this.req.query.cases === queryBuildCases.getAllProducts) {
//       query[Op.or].push({ '$quotes.order.order_number$': { [Op.like]: `%${searchText}%` } });
//       query[Op.or].push({ $title$: { [Op.like]: `%${searchText}%` } });
//     }
//     if (this.req?.query?.search && this.req.query.cases === queryBuildCases.getAllInvoice) {
//       query[Op.or].push({ '$invoice_product.company.name$': { [Op.like]: `%${searchText}%` } });
//       query[Op.or].push({ '$invoice_product.order.order_number$': { [Op.like]: `%${searchText}%` } });
//     }
//     if (this.req?.query?.search && this.req.query.cases === queryBuildCases.getAllInvoice) {
//       query[Op.or].push({ '$invoice_product.company.name$': { [Op.like]: `%${searchText}%` } });
//       query[Op.or].push({ '$invoice_product.order.order_number$': { [Op.like]: `%${searchText}%` } });
//     }
//     if (this.req?.query?.search && this.req.query.cases === queryBuildCases.getAllCreditNotes) {
//       query[Op.or].push({ '$invoice.invoice_number$': { [Op.like]: `%${searchText}%` } });
//       query[Op.or].push({ '$company.name$': { [Op.like]: `%${searchText}%` } });
//       query[Op.or].push({ '$order.order_number$': { [Op.like]: `%${searchText}%` } });
//     }
//     searchFields.forEach((field) => {
//       switch (this.getFieldType(field)) {
//         case 'STRING':
//         case 'TEXT':
//           query[Op.or].push({ [field]: { [Op.like]: `%${searchText}%` } });
//           break;
//         case 'INT':
//           query[Op.or].push({ [field]: { [Op.contains]: parseInt(searchText, 10) } });
//           break;
//         case 'FLOAT':
//           query[Op.or].push({ [field]: { [Op.contains]: parseFloat(searchText) } });
//           break;
//         case 'JSONB_emails':
//         case 'JSONB_phones':
//           query[Op.or].push(
//             where(
//               literal(field.split('.')?.length > 1 ? `"${this.model?.name}"."${field}"::text` : `${field}::text`),
//               Op.like,
//               `%"value": "%${searchText}%"%`,
//             ),
//           );
//           break;
//         case 'DATE':
//         case 'DATETIME':
//           // if (isValidDate(searchText)) {
//           // TO_CHAR(current_date, 'MM/DD/YYYY')
//           query[Op.or].push(
//             where(literal(`TO_CHAR("${this.model?.name}"."${field}", 'MM/DD/YYYY')`), Op.like, `%${searchText}%`),
//           );
//           // }
//           break;
//         case 'ARRAY':
//         case 'JSONB':
//         default:
//           query[Op.or].push(
//             where(
//               literal(field?.split?.('.')?.length > 1 ? `${field}::text` : `"${this.model?.name}"."${field}"::text`),
//               Op.like,
//               `%${searchText}%`,
//             ),
//           );
//           break;
//       }
//     });
//     return query;
//   };

//   private readonly getStringFields = () => {
//     const fields = this.model.getAttributes();
//     const data = {};
//     if (!_.isEmpty(fields)) {
//       for (const [key, value] of Object.entries(fields)) {
//         if (!['adminPassword', 'password'].includes(key)) {
//           if (value.type?.constructor?.name === 'STRING') {
//             data[key] = value;
//           }
//           if (value.type?.constructor?.name === 'TEXT') {
//             data[key] = value;
//           }
//         }
//       }
//     }

//     return data;
//   };

//   private readonly getFieldType = (field: string) => {
//     const fieldType = this.model.getAttributes()?.[field]?.type?.constructor?.name;

//     if ((field === 'emails' || field === 'phones') && fieldType === 'JSONB') {
//       return `${fieldType}_${field}`;
//     }

//     return fieldType;
//   };

//   readonly getQuery = () => {
//     const searchText = _.get(this.req.query, 'search', '') as string;
//     const searchFields = !_.isEmpty(this.req.query.searchFields)
//       ? (this.req.query.searchFields as string)
//       : (Object.keys(this.getStringFields()).join(',') as string);

//     const validSearchFields = this.validateFields(searchFields);

//     if (searchText && validSearchFields?.length && !this.req?.query?.ignoreSearchField) {
//       return this._getQuery(searchText, validSearchFields);
//     }
//     return null;
//   };

//   private readonly validateFields = (searchFields: string) => {
//     const splitFields = (searchFields || '').split(',');
//     const validFields = (splitFields || []).filter((field: string) => this.model.getAttributes()[field]);
//     const associatedFields = _.chain(splitFields || [])
//       .filter((field) => !!(field?.split('.')?.length > 1 && this.model.associations[field?.split('.')?.at(0)]))
//       .value();
//     return (validFields || []).concat(associatedFields || []);
//   };
// }
