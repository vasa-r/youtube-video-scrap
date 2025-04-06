import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";
import verifyToken from "../middleware/verify-token";

const authRouter = Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.get("/verify-email", AuthController.verifyEmail);
authRouter.post(
  "/resend-verification-email",
  AuthController.resendVerificationEmail
);
authRouter.get("/me", verifyToken, AuthController.getProfile);

export default authRouter;
