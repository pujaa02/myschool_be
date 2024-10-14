import { Routes } from '@/common/interfaces/general/routes.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import { fileUpload } from '@/middlewares/multer.middleware';
import { translateUserData } from '@/middlewares/translation.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import UserController from '@/modules/user/controller/user.controller';
import { Router } from 'express';
import multer from 'multer';
import AuthController from '../controller/auth.controller';
import {
  ResetPasswordSchema,
  Verify2FASchema,
  changePasswordSchema,
  loginSchema,
  otpResendSchema,
  otpVerificationSchema,
  register,
  registerPrivateIndividual,
} from '../validations/auth.validation';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // login route
    this.router.post(`${this.path}/login`, multer().none(), validationMiddleware(loginSchema, 'body'), this.authController.login);

    // logout route
    this.router.post(`${this.path}/logout`, multer().none(), authMiddleware, this.authController.logout);

    // Register route
    this.router.post(
      `${this.path}/register`,
      fileUpload(1),
      validationMiddleware(register, 'body'),
      this.authController.registerUser,
    );

    this.router.post(
      `${this.path}/register/private-individual`,
      fileUpload(1),
      validationMiddleware(registerPrivateIndividual, 'body'),
      this.authController.registerPrivateIndividualUser,
    );

    // Send otp using email
    this.router.post(
      `${this.path}/send-otp`,
      multer().none(),
      validationMiddleware(otpResendSchema, 'body'),
      this.authController.resendOTP,
    );

    // Verify otp for email
    this.router.post(
      `${this.path}/otp-verification`,
      multer().none(),
      validationMiddleware(otpVerificationSchema, 'body'),
      this.authController.otpVerification,
    );

    // Change Password
    this.router.post(
      `${this.path}/change-password`,
      authMiddleware,
      validationMiddleware(changePasswordSchema, 'body'),
      this.authController.changePassword,
    );

    // Forgot Password
    this.router.post(
      `${this.path}/forgot-password`,
      validationMiddleware(otpResendSchema, 'body'),
      this.authController.resendOTP,
    );

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

    this.router.post(
      `${this.path}/2FA/verify`,
      multer().none(),
      authMiddleware,
      validationMiddleware(Verify2FASchema, 'body'),
      this.authController.setup2FAVerify,
    );
    this.router.get(`${this.path}/2FA/qr`, authMiddleware, this.authController.getTwoFactorAuthQR);
  }
}

export default AuthRoute;
