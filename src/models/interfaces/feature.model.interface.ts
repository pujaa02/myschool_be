import { RequiredKey } from './common.model.interface';

export type FeatureAttributes = {
  id?: number;
  name?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
};

export type RequiredFeatureAttributes = RequiredKey<FeatureAttributes, 'name'>;
