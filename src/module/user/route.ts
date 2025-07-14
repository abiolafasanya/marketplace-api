import { Router } from "express";
import AuthController from "./controller";
import { authenticate } from "../../commons/middleware/auth";

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
}
