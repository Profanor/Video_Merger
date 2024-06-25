import express from "express";
import { upload, mergeVideos } from "../controller/videoController";

const router = express.Router();

router.post('/merge', upload.array('videos', 2), mergeVideos);

export default router;