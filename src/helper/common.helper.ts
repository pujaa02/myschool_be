import _ from 'lodash';
import sanitizeHtml from 'sanitize-html';
import { Model } from 'sequelize-typescript';

export const sanitizeHtmlFieldsAllModules = (model: Model) => {
  _.forEach(model.toJSON(), (value, key) => {
    if (typeof value === 'string' && value) {
      model[key] = sanitizeHtml(value).replaceAll('&amp;', '&');
    }
  });
};
