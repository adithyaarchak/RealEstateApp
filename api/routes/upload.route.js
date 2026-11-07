import express from "express";
import { imagekit } from "../utils/imagekit.js";

const router = express.Router();

router.get("/imagekit-auth", (req, res) => {
  const authParams = imagekit.getAuthenticationParameters();
  res.json(authParams);
});

export default router;