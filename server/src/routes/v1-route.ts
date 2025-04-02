import { Router } from "express";
import authRouter from "./auth-routes";
import videoRouter from "./video-routes";
import verifyToken from "../middleware/verify-token";

const v1 = Router();

v1.use("/auth", authRouter);
v1.use("/video", verifyToken, videoRouter);

export default v1;
