import { Routes } from '@/common/interfaces/general/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { fileUpload } from '@/middlewares/multer.middleware';
import { translateUserData } from '@/middlewares/translation.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Router } from 'express';
import multer from 'multer';
import AuthController from '../controller/auth.controller';
import {  ChangePasswordSchema, LoginSchema, RegisterSchema, ResetPasswordSchema } from '../validations/auth.validation';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // login route
    this.router.post(`${this.path}/login`, multer().none(), validationMiddleware(LoginSchema, 'body'), this.authController.login);

    // logout route
    this.router.post(`${this.path}/logout`, multer().none(), authMiddleware, this.authController.logout);

    // Register route
    this.router.post(
      `${this.path}/register`,
      fileUpload(1),
      validationMiddleware(RegisterSchema, 'body'),
      this.authController.registerUser,
    );



    // Change Password
    this.router.post(
      `${this.path}/change-password`,
      authMiddleware,
      validationMiddleware(ChangePasswordSchema, 'body'),
      this.authController.changePassword,
    );

    // // Forgot Password
    // this.router.post(
    //   `${this.path}/forgot-password`,
    //   validationMiddleware(otpResendSchema, 'body'),
    //   this.authController.resendOTP,
    // );

    // Set Password
    this.router.post(
      `${this.path}/set-password`,
      multer().none(),
      authMiddleware,
      validationMiddleware(ResetPasswordSchema, 'body'),
      this.authController.setPassword,
    );

    // Reset Password
    this.router.post(
      `${this.path}/reset-password`,
      multer().none(),
      validationMiddleware(ResetPasswordSchema, 'body'),
      this.authController.setPassword,
    );

    // Get Logged In
    this.router.get(`${this.path}/getLoggedIn`, authMiddleware, translateUserData, this.authController.getLoggedIn);

  
  }
}

export default AuthRoute;
