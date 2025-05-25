import { Router } from "express";
import { createSong, deleteSong, createAlbum, deleteAlbum, checkAdmin, getActionLog } from "../controller/admin.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// slightly optimized cleaner code
router.use(protectRoute, requireAdmin);

router.get("/check", checkAdmin);

router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);

router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum);

router.get("/action-log/:adminId", getActionLog); 
export default router;