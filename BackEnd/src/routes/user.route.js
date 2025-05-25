import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllUsers, getMessages, getHistory, saveSongToHistory } from "../controller/user.controller.js";
import { User } from "../models/user.model.js";
const router = Router();

router.get("/", protectRoute, getAllUsers);
router.get("/messages/:userId", protectRoute, getMessages);
router.get("/history/:userId", protectRoute, getHistory);
router.post("/history/:userId", protectRoute, saveSongToHistory);
router.get("/by-clerk/:clerkId", protectRoute, async (req, res, next) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (e) {
    next(e);
  }
});

export default router;