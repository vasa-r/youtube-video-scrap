import { Router } from "express";
import { VideoController } from "../controllers/video-controller";
import { validateYtUrl } from "../middleware/validate-yturl";

const videoRouter = Router();

videoRouter.post("/info", validateYtUrl, VideoController.getVideoInfo);
videoRouter.post("/audio", validateYtUrl, VideoController.downloadAudio);

export default videoRouter;
