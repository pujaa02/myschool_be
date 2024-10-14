import BaseRepository from '@/modules/common/base.repository';
import Feature from '@/sequelizeDir/models/feature.model';

export default class FeatureRepo extends BaseRepository<Feature> {
  constructor() {
    super(Feature.name);
  }
}
