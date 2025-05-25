import express from "express";
import {
  createPlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getAllPlaylists,
} from "../controller/playlist.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create a new playlist
router.post("/", protectRoute, createPlaylist);

// Delete a playlist
router.delete("/:playlistId", protectRoute, deletePlaylist);

// Add a song to a playlist
router.post("/:playlistId/songs", protectRoute, addSongToPlaylist);

// Remove a song from a playlist
router.delete("/:playlistId/songs/:songId", protectRoute, removeSongFromPlaylist);

// Get all playlists for the current user
router.get("/", protectRoute, getAllPlaylists);

export default router;
