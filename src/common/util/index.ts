// ** Package **
import CryptoJS from 'crypto-js';
import { format, toZonedTime } from 'date-fns-tz';
import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import _, { isEmpty } from 'lodash';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';
// ** Others **
import { SECRET_KEY } from '../../config';
import { getDate, getHours, getMinutes, getMonth, getSeconds, getYear } from 'date-fns';
import { Transaction } from 'sequelize';
import { LanguageEnum, LanguageEnumCMS } from '../interfaces/general/general.interface';

export const toCapitalize = (str: string) => {
  return _.capitalize(str.replace(/_/g, ' '));
};
export const Bool = (str) => (/^(true|1|yes)$/i.test(str) ? true : /^(false|0|no)$/i.test(str) ? false : false);

// Encrypt
export const encrypt = (data: string) => {
  const cipherText = encodeURIComponent(CryptoJS.AES.encrypt(data, SECRET_KEY).toString());
  return cipherText;
};

export const flatten = function (data) {
  const result = {};
  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (let i = 0, l = cur.length; i < l; i++) {
        recurse(cur[i], prop + '[' + i + ']');
        if (l == 0) result[prop] = [];
      }
    } else {
      let isEmptyData = true;
      for (const p in cur) {
        isEmptyData = false;
        recurse(cur[p], prop ? prop + '.' + p : p);
      }
      if (isEmptyData && prop) result[prop] = {};
    }
  }
  recurse(data, '');
  return result;
};

export const unflatten = function (data) {
  'use strict';
  if (Object(data) !== data || Array.isArray(data)) return data;
  const regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
    resultHolder = {};
  for (const p in data) {
    let cur = resultHolder,
      prop = '',
      m;
    while ((m = regex.exec(p))) {
      cur = cur[prop] || (cur[prop] = m[2] ? [] : {});
      prop = m[2] || m[1];
    }
    cur[prop] = data[p];
  }
  return resultHolder[''] || resultHolder;
};
export function checkAndReplace(key, result: any, replaceData): any {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  if (_.isArray(result)) return result.map((r) => checkAndReplace(key, r, replaceData));
  if (!_.isObject(result)) return result;
  result = flatten(result);
  result = _.mapValues(result, (value, _key) => {
    if (_key.includes(key)) {
      value = replaceData;
    }
    return value;
  });

  result = unflatten(result);
  return result;
}

// Decrypt
export const decrypt = (data: string) => {
  const bytes = CryptoJS.AES.decrypt(decodeURIComponent(data), SECRET_KEY).toString(CryptoJS.enc.Utf8);
  return bytes;
};

export const generateFourDigitNumber = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const parseData = (data: any) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
};

export const parse = (el: any) => JSON.parse(JSON.stringify(el));

export const stringify = (el: any) => JSON.stringify(el);

export const isNumeric = (n: any) => {
  // eslint-disable-next-line no-restricted-globals
  return n && !isNaN(parseFloat(n)) && isFinite(n);
};

export const cleanObj = (obj: { [key: string]: any }) => {
  Object.keys(obj).forEach((key: string) => {
    try {
      if (obj[key] === '') {
        obj[key] = null;
      }
      if (!isNumeric(obj[key])) {
        obj[key] = JSON.parse(obj[key]);
      }
    } catch (err) {
      // do nothing
    }
  });
  return obj;
};

export const catchAsync = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    return next(err);
  });
};

export const fileOrFolderExistCheck = (path: string): boolean => {
  if (fs.existsSync(path)) {
    return true;
  } else {
    fs.mkdirSync(path, { recursive: true });
    return true;
  }
};

export const fromBase64 = (str: string) => {
  return JSON.parse(Buffer.from(str, 'base64').toString());
};

export const generateRandomPassword = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:<>?-=[];,./`~';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  password = 'U@1' + password;
  return password;
};

export const generateSlugifyForModel = async (
  data: string,
  model: any,
  field?: string,
  lower?: boolean,
  transaction?: Transaction,
): Promise<string> => {
  const slugifyData = slugify(data, { lower: lower });

  const where = field ? { [field]: slugifyData } : { slug: slugifyData };
  const isExist = await model.findOne({ where, attributes: ['id'], ...(transaction ? { transaction } : {}) });

  if (!isEmpty(isExist)) {
    const postfix = uuidv4().slice(0, 2) + 1;
    const data1 = await generateSlugifyForModel(`${data}_0${postfix}`, model, field);
    return await generateSlugifyForModel(`${data}_0${postfix}`, model, field);
  }

  return slugifyData;
};

export const generateQuoteNumber = async (model: any, field?: string): Promise<string> => {
  const randomQuoteNumber = `Quote#` + Math.floor(100000 + Math.random() * 900000);

  const isExist = await model.findOne({ where: { [field || 'quote_number']: randomQuoteNumber } });
  if (!isEmpty(isExist)) {
    return await generateQuoteNumber(model);
  }
  return randomQuoteNumber;
};

export const generateCodeForModel = async (data: string, model: any, field?: string, where?: any): Promise<string> => {
  const slugifyData = slugify(data);

  const isExist = await model.findOne({ where: { [field || 'slug']: slugifyData }, ...(where ? where : {}) });
  if (!isEmpty(isExist)) {
    const postfix = uuidv4().slice(0, 2) + 1;
    const prefix = uuidv4().slice(0, 2) + 1;
    return await generateSlugifyForModel(`${prefix}${data}0${postfix}`, model, field);
  }
  return slugifyData;
};

export const generateSlug = async (
  identifier: string,
  model: any,
  language: LanguageEnum | LanguageEnumCMS,
): Promise<string> => {
  const timestamp = new Date().getTime();
  const randomIdentifier = Math.floor(Math.random() * 1000000);
  const uniqueIdentifier = `${timestamp}_${randomIdentifier}`;
  const slug = `${identifier}_${uniqueIdentifier}`;
  const isExist = await model.findOne({ where: { slug } });
  if (isExist) {
    return await generateSlug(identifier, model, language);
  }
  return slug;
};

export function findMostMatchedString(str1, data) {
  const matches = data.map((item) => {
    const count = countMatchingCharacters(item.replace(/_/g, ''), str1);
    return { item, count: count.count, minLength: count.minLength, dif: count.dif, strDif: count.strDif };
  });
  const d = matches.reduce((maxItem, currentItem) => (currentItem.count > maxItem.count ? currentItem : maxItem), {
    count: -1,
  });
  if (d.dif < 3 && d.strDif < 3) return str1;
  return false;
}

function countMatchingCharacters(str1, str2) {
  const minLength = Math.min(str1.length, str2.length);
  let matchCount = 0;
  for (let i = 0; i < minLength; i++) {
    if (str1[i].toLowerCase() === str2[i].toLowerCase()) {
      matchCount++;
    }
  }

  const str2LenDif = str2.length - matchCount;
  return { minLength, count: matchCount, dif: minLength - matchCount, strDif: str2LenDif };
}

function mergeArrayOfObjectsBySlug(objects) {
  const mergedObject = {};

  objects.forEach((obj) => {
    const keys = Object.keys(obj);

    keys.forEach((key) => {
      if (key !== 'language') {
        // Adding language to each key
        const newKey = `${key}_${obj.language.toLowerCase()}`;

        // Merging objects based on slug
        if (key === 'slug') {
          mergedObject[key] = mergedObject[key] || obj[key];
        } else {
          mergedObject[newKey] = obj[key];
        }
      }
    });
  });

  return mergedObject;
}

const mergeArrayProps = (arr1, arr2, _props) => {
  return arr1?.map((e, i) => {
    const data = {
      ...e,
      // parent_table_id: !_.isUndefined(arr2[i]) || !_.isNull(arr2[i]) ? arr2[i]['id'] : null,
      slug: arr2[i]['slug'],
    };

    return data;
  });
};

export const changeObject = (obj2) => {
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (typeof obj2[key] === 'object' && obj2[key] !== null && !Array.isArray(obj2[key])) {
        // Recursive call for nested objects
        obj2[key] = changeObject(obj2[key]);
      } else if (Array.isArray(obj2[key])) {
        // Concatenate arrays
        obj2[key] = obj2[key].map((e) => changeObject(e));
      } else {
        // Assign values for other types
        // if (key === 'od') {
        //   obj2['parent_table_id'] = obj2[key];
        // }
        obj2[key] = obj2[key];
      }
    }
  }
  return obj2;
};

export const mergeLanguageObjects = (data) => {
  const groupedByLanguage = _.groupBy(data, 'slug');
  const returnData = [];
  Object.values(groupedByLanguage).forEach((value) => {
    const merged = mergeArrayOfObjectsBySlug(value);
    returnData.push(merged);
  });
  return returnData;
};

export const calculateDurationInMinutes = (start: Date, end: Date) => {
  // Calculate the difference in milliseconds
  const durationInMilliseconds = end.getTime() - start.getTime();

  // Convert the duration to minutes
  const durationInMinutes = durationInMilliseconds / (1000 * 60);

  return durationInMinutes;
};

export const objectToQueryParamString = (obj) => {
  const queryParams = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = encodeURIComponent(obj[key]);
      queryParams.push(`${key}=${value}`);
    }
  }

  return queryParams.join('&');
};

export function removeKey(obj: any, keyToRemove: string): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj; // If the current value is not an object, return it as is
  }

  if (Array.isArray(obj)) {
    // If it's an array, apply the removeKey function to each element
    return obj.map((item) => removeKey(item, keyToRemove));
  }

  const result: any = {};
  for (const key in obj) {
    if (key !== keyToRemove) {
      // Copy the key-value pair, excluding the specified key
      result[key] = removeKey(obj[key], keyToRemove);
    }
  }

  return result;
}

export function replaceKeyRecursively(obj) {
  if (typeof obj !== 'object' || obj === null) {
    // Base case: If the current value is not an object, or is null, return it as is
    return obj;
  }

  // Create a new object to store the modified key-value pairs
  const newObj = {};

  // Iterate over the keys of the object
  // for (const key in obj) {
  // Replace 'id' with 'parent_table_id' in the key
  // const newKey = key === 'id' ? 'parent_table_id' : key;

  // Recursively call the function for nested objects or arrays
  // newObj[newKey] = replaceKeyRecursively(obj[key]);
  // }

  return newObj;
}

export const imageFieldNormalizer = (field): string[] => {
  const fieldType = typeof field;
  if (fieldType === 'string') {
    return [field];
  } else if (fieldType === 'object') {
    return [...field];
  } else {
    return [];
  }
};

export const findDuplicates = (array: any[]) => {
  const seen = new Set();
  const duplicates = new Set();

  for (const element of array) {
    if (seen.has(element)) {
      duplicates.add(element);
    } else {
      seen.add(element);
    }
  }

  return Array.from(duplicates);
};

export const checkBreakOverlap = (
  existingBreaks: { break_in: Date; break_out: Date }[],
  newBreaks: { break_in: Date; break_out: Date }[],
) => {
  for (const existingBreak of existingBreaks) {
    for (const newBreak of newBreaks) {
      const existingStartTime = new Date(existingBreak.break_in);
      const existingEndTime = new Date(existingBreak.break_out);
      const newStartTime = new Date(newBreak.break_in);
      const newEndTime = new Date(newBreak.break_out);

      if (
        (newStartTime >= existingStartTime && newStartTime < existingEndTime) ||
        (newEndTime > existingStartTime && newEndTime <= existingEndTime) ||
        (newStartTime <= existingStartTime && newEndTime >= existingEndTime)
      ) {
        return true;
      }
    }
  }
  return false;
};

export const calculateHours = (startTime: Date | string, endTime: Date | string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const durationMs = end.getTime() - start.getTime();

  const durationHours = durationMs / (1000 * 60 * 60);

  return durationHours;
};

export const generateRandomNumber = (length: number) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const checkZoomOverlap = (start: Date, end: Date, existing: { start_time: Date; duration: number }[]) => {
  const startTime = new Date(start);
  const endTime = new Date(end);

  for (const e of existing) {
    const existingStartTime = new Date(e.start_time);
    const existingEndTime = new Date(e.start_time);
    existingEndTime.setMinutes(existingEndTime.getMinutes() + e.duration);

    if (
      (startTime >= existingStartTime && startTime < existingEndTime) ||
      (endTime > existingStartTime && endTime <= existingEndTime) ||
      (startTime <= existingStartTime && endTime >= existingEndTime)
    ) {
      return 1;
    }
  }
  return 0;
};

export const mergeDateAndTime = (datePart, timePart) => {
  // Extract date components from datePart

  const year = getYear(datePart);
  const month = getMonth(datePart); // Note: getMonth returns 0-based month
  const date = getDate(datePart);

  // Extract time components from timePart
  const hours = getHours(timePart);
  const minutes = getMinutes(timePart);
  const seconds = getSeconds(timePart);

  // Create a new date with merged components
  return new Date(year, month, date, hours, minutes, seconds);
};

export function formatToUTC(dateString, formatString) {
  const date = dateString ? new Date(dateString) : new Date();

  // Convert to UTC time
  const utcDate = toZonedTime(date, 'UTC');

  // Format the UTC date
  return format(utcDate, formatString, { timeZone: 'UTC' });
}

export const convertObjectToKeyValuePairs = (obj) => {
  const keyValuePairs = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newlineIndex = key.indexOf('\n');
        const newKey = newlineIndex !== -1 ? key.substring(0, newlineIndex) : key;
        keyValuePairs[newKey.replace(/[^a-zA-Z0-9]/g, '')] = obj[key];
      }
    }
  }

  return keyValuePairs;
};
