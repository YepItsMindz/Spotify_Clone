import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
    required: false,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  ],
}, { timestamps: true });

export const Playlist = mongoose.model("Playlist", PlaylistSchema);
