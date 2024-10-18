import { FeaturesEnum } from '../common/constants/enum.constant';
import { logger } from '../common/util/logger';
import featureRepository from '../modules/feature/repository/feature.repository';
const addFeatures = async () => {
  try {
    const allFeatures = [];
    const featureRepo = new featureRepository();
    const keys = Object.keys(FeaturesEnum);
    let allExistingFeature: any = await featureRepo.getAll({ attributes: ['name'] });
    allExistingFeature = allExistingFeature.map((data) => data.name);
    allExistingFeature = keys.filter((data) => !allExistingFeature.includes(data));
    for (const key of allExistingFeature) {
      allFeatures.push({
        name: FeaturesEnum[key],
      });
    }
    if (allFeatures?.length > 0) {
      await featureRepo.bulkCreate(allFeatures, {
        ignoreDuplicates: true,
      });
    }
    logger.info('Features Inserted Successfully !!');
  } catch (error) {
    logger.error('Something Went Wrong !!', error);
  }
};

addFeatures();
