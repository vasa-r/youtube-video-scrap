import { Router } from "express";
import authRouter from "./auth-routes";

const v1 = Router();

v1.use("/auth", authRouter);

export default v1;
