import Feature from '../../../models/feature.model';
import BaseRepository from '../../../modules/common/base.repository';

export default class FeatureRepo extends BaseRepository<Feature> {
  constructor() {
    super(Feature.name);
  }
}
