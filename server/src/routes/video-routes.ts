import { Router } from "express";
import { VideoController } from "../controllers/video-controller";
import { validateYtUrl } from "../middleware/validate-yturl";

const videoRouter = Router();

videoRouter.get("/", VideoController.getUserVideos);

videoRouter.get("/jobs", VideoController.getAllJobs);

videoRouter.get("/:videoId", VideoController.getVideoById);

videoRouter.post("/info", validateYtUrl, VideoController.getVideoInfo);

videoRouter.post("/audio", validateYtUrl, VideoController.downloadAudio);

videoRouter.post("/transcribe", validateYtUrl, VideoController.transcribeVideo);

videoRouter.get(
  "/transcribe/:jobId/status",
  VideoController.getTranscriptionStatus
);

export default videoRouter;
