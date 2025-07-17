import { Router } from "express";
import AuthController from "./controller";
import { authenticate } from "../../common/middleware/auth";

export default function (router: Router) {
  router.post("/auth", AuthController.login);
  router.post("/auth/register", AuthController.register);
  router.post("/auth/logout", AuthController.logout);
  router.get("/auth/me", authenticate, AuthController.me);
  router.patch("/auth/profile", authenticate, AuthController.updateProfile);
  router.post(
    "/auth/change-password",
    authenticate,
    AuthController.changePassword
  );
  router.post("/forgot-password", AuthController.forgotPassword);
  router.post("/reset-password", AuthController.resetPassword);
  router.get("/verify-email", AuthController.verifyEmail);

  router.post(
    "/phone/send-code",
    authenticate,
    AuthController.requestPhoneVerificationCode
  );
  router.post(
    "/phone/verify-code",
    authenticate,
    AuthController.verifyPhoneCode
  );
}
