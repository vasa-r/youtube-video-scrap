import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";

const authRouter = Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.get("/verify-email", AuthController.verifyEmail);
authRouter.post(
  "/resend-verification-email",
  AuthController.resendVerificationEmail
);

export default authRouter;
