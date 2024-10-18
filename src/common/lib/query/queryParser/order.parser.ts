import { parseStr } from './sortString.parser';

export default class OrderParser {
  constructor(readonly sort: string) {
    //
  }

  readonly getQuery = () => {
    return this._getQuery(this.sort);
  };

  private readonly _getQuery = (sort: string) => {
    return parseStr(sort || '').map((fraction: string) => {
      const splitFraction = fraction.split('.');
      if (splitFraction.length > 1) {
        const SeparateTableQuery = [
          splitFraction[0].startsWith('-') ? splitFraction[0].slice(1, splitFraction[0].length) : splitFraction[0],
          ...splitFraction.slice(1),
          splitFraction[0].startsWith('-') ? 'DESC' : 'ASC',
        ];
        return SeparateTableQuery;
      } else {
        const sameTableQuery = [
          splitFraction[0].startsWith('-') ? splitFraction[0].slice(1, splitFraction[0].length) : splitFraction[0],
          splitFraction[0].startsWith('-') ? 'DESC' : 'ASC',
        ];
        return sameTableQuery;
      }
    });
  };
}
