import db from './models';
import { logger } from './common/util/logger';
import AuthRoute from './modules/auth/routes/auth.route';
import UserRoute from './modules/user/routes/user.route';
import FeatureRoute from './modules/feature/routes/feature.route';
import PermissionRoute from './modules/permission/routes/permission.route';
import RoleRoute from './modules/role/routes/role.route';
import RolePermissionRoute from './modules/rolePermission/routes/rolePermission.route';
import { initializeApp } from './app';

const routes = [
  new AuthRoute(),
  new FeatureRoute(),
  new PermissionRoute(),
  new RoleRoute(),
  new RolePermissionRoute(),
  new UserRoute(),
];

const main = async () => {
  try {
    await db.authenticate();
    const apiRoutes = routes;
    await initializeApp(apiRoutes);
  } catch (err) {
    logger.error('[SERVER START]: %s', err);
    process.exit(1);
  }
};

main();
