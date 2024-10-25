import { Routes } from '@/common/interfaces/general/routes.interface';
import { Router } from 'express';
import PublicController from '../controller/public.controller';

class PublicRoute implements Routes {
  public path = '';
  public router = Router();
  public publicController = new PublicController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/getCountriesJson`,
      () => {
        console.log('countryyyyyyyyyyyyy');
      },
      this.publicController.getLoggedIn,
    );
    // this.router.get(`${this.path}/getLanguages`, this.publicController.getLanguages);
    // this.router.get(`${this.path}/getDefaultLanguage`, this.publicController.getDefaultLanguage);
  }
}

export default PublicRoute;
