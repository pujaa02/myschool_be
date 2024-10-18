import { Request } from 'express';

export const getPaginationParams = (req: Request) => {
  const page: number = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const search = req.query.search && req.query.search.toString() !== '' ? req.query.search.toString() : '';
  const skip: number = (Number(page) - 1) * Number(limit);
  const filter = req.query.filter ? req.query.filter : false;
  const id = req.query.id ? Number(req.query.id) : null;
  const slug: string = req.query.slug ? String(req.query.slug) : null;
  const listView = req.query.view ? true : false;
  return { page, limit, search, skip, slug, filter, id, listView };
};

export const paginatedResults = (page: number, limit: number, model: string | any[]) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  let results: any = {};
  if (endIndex < model?.length) {
    results = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results = {
      page: page - 1,
      limit: limit,
    };
  }

  results = model.slice(startIndex, endIndex);

  return results;
};

export const checkParamId = (value: string | number, moduleName: string) => {
  const param = Number(value);
  if (!param || isNaN(param) || param === undefined) {
    throw new Error(`${moduleName} id is missing`);
  }
  return param;
};
