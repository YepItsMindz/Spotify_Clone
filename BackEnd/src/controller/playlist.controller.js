import { Playlist } from "../models/playlist.model.js";
import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import { Song } from "../models/song.model.js";

// helper function to upload file to cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error in uploadToCloudinary", error);
    throw new Error("Error in uploading file to cloudinary");
  }
};

// Create a new playlist
export const createPlaylist = async (req, res, next) => {
  try {
    const clerkId = req.auth.userId; // Clerk user ID
    const { title, description } = req.body;
    let imageUrl = "";
    if (req.files && req.files.imageFile) {
      imageUrl = await uploadToCloudinary(req.files.imageFile);
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }
    // Find the user by clerkId to get the MongoDB _id
    const user = await mongoose.model("User").findOne({ clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });
    const playlist = new Playlist({
      userId: user._id,
      title,
      description,
      imageUrl,
      songs: [],
    });
    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
};

// Get all playlists
export const getAllPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find().sort({ createdAt: -1 });
    res.status(200).json(playlists);
  } catch (error) {
    next(error);
  }
};

// Delete a playlist
export const deletePlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const clerkId = req.auth.userId;
    // Find the user by clerkId to get the MongoDB _id
    const user = await mongoose.model("User").findOne({ clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });
    // Only delete if the playlist exists and belongs to the current user
    const playlist = await Playlist.findOne({ _id: playlistId, userId: user._id });
    if (!playlist) return res.status(404).json({ message: "Playlist not found or not authorized" });
    await Playlist.deleteOne({ _id: playlistId });
    res.status(200).json({ message: "Playlist deleted" });
  } catch (error) {
    next(error);
  }
};

// Add a song to a playlist
export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const { songId } = req.body;
    if (!songId) {
      return res.status(400).json({ message: "songId is required" });
    }
    // Check if the song exists
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });
    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ message: "Song already in the playlist" });
    }
    playlist.songs.push(songId);
    await playlist.save();
    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

// Remove a song from a playlist
export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });
    const initialLength = playlist.songs.length;
    playlist.songs = playlist.songs.filter(
      (id) => id.toString() !== songId
    );
    if (playlist.songs.length === initialLength) {
      return res.status(404).json({ message: "Song not found in playlist" });
    }
    await playlist.save();
    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

// Delete a song from a playlist (utility function)
export const deleteSongFromPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.params;
    const clerkId = req.auth.userId;
    // Find the user by clerkId to get the MongoDB _id
    const user = await mongoose.model("User").findOne({ clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });
    // Only update if the playlist exists and belongs to the current user
    const playlist = await Playlist.findOne({ _id: playlistId, userId: user._id });
    if (!playlist) return res.status(404).json({ message: "Playlist not found or not authorized" });
    const initialLength = playlist.songs.length;
    playlist.songs = playlist.songs.filter((id) => id.toString() !== songId);
    if (playlist.songs.length === initialLength) {
      return res.status(404).json({ message: "Song not found in playlist" });
    }
    await playlist.save();
    res.status(200).json({ message: "Song deleted from playlist", playlist });
  } catch (error) {
    next(error);
  }
};
