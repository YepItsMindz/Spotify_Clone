import {Song} from '../models/song.model.js';
import {Album} from '../models/album.model.js';
import { ActionLog } from '../models/actionLog.model.js';
import cloudinary from '../lib/cloudinary.js';

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

const logAdminAction = async (adminId, action, description) => {
  try {
    const log = new ActionLog({
      adminId,
      action,
      description,
    });
    await log.save();
    return true;
  } catch (error) {
    console.log("Error in logging admin action", error);
  }
};

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload all files" });
    }

    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumId: albumId || null
    })

    await song.save();

    //if song belongs to an album, update the album's songs array
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, { 
        $push: { songs: song._id },
      });
    }

    const adminId = req.auth.userId;
    await logAdminAction(adminId, "CREATE", `Created song: ${title}`);
    
    res.status(201).json(song);
  } catch (error) {
    console.log("Error in createSong", error);
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);

    //if song belongs to an album, update the album's songs array
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    };

    await Song.findByIdAndDelete(id);

    const adminId = req.auth.userId;
    await logAdminAction(adminId, "DELETE", `Deleted song with ID: ${id}`);

    res.status(200).json({ message: "Song deleted successfully" });

  } catch (error) {
    console.log("Error in deleteSong", error);
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;

    const imageUrl = await uploadToCloudinary(imageFile);

    const album = new Album({
      title,
      artist,
      imageUrl,
      releaseYear
    });

    await album.save();

    const adminId = req.auth.userId;
    await logAdminAction(adminId, "CREATE", `Created album: ${title}`);

    res.status(201).json(album);
  } catch (error) {
    console.log("Error in createAlbum", error);
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);

    const adminId = req.auth.userId;
    await logAdminAction(adminId, "DELETE", `Deleted album with ID: ${id}`);

    res.status(200).json({ message: "Album deleted successfully" });

  } catch (error) {
    console.log("Error in deleteAlbum", error);
    next(error);
  }
};

export const getActionLog = async (req, res, next) => {
  try {
    const { adminId } = req.params; // Get adminId from route params

    // Fetch action logs for the current admin
    const logs = await ActionLog.find({ adminId })
      .sort({ performedAt: -1 }) // Sort by most recent actions
      .limit(50); // Limit to the latest 50 logs

    res.status(200).json(logs);
  } catch (error) {
    console.log("Error in getActionLog", error);
    next(error);
  }
};

export const checkAdmin = async (req, res, next) => {
  res.status(200).json({ admin: true });
};
