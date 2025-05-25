import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { History } from "../models/history.model.js";
import mongoose from "mongoose";


export const getAllUsers = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;
		const users = await User.find({ clerkId: { $ne: currentUserId } });
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

export const getMessages = async (req, res, next) => {
	try {
		const myId = req.auth.userId;
		const { userId } = req.params;

		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		next(error);
	}
};

export const getHistory = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const history = await History.find({ userId: userId })
			.populate("songId")
			.sort({ listenedAt: -1 })
			.limit(20);

		res.status(200).json(history);
	} catch (error) {
		next(error);
	}
};

export const saveSongToHistory = async (req, res, next) => {
  const { userId } = req.params;
  const { songId } = req.body;

  try {
    // Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Check if the song already exists in the user's history
    const existingHistory = await History.findOne({
      userId: userObjectId,
      songId: songId,
    });

    if (existingHistory) {
      // Update the listenedAt timestamp to the current time
      existingHistory.listenedAt = new Date();
      await existingHistory.save();
      return res.status(200).json({ message: "Song already in history, timestamp updated" });
    }

    // Create a new history entry for the song
    const newHistory = new History({
      userId: userObjectId,
      songId: songId,
      listenedAt: new Date(),
    });

    // Save the new history entry
    await newHistory.save();

    // Count the total number of history entries for the user
    const historyCount = await History.countDocuments({ userId: userObjectId });

    if (historyCount > 20) {
      // Remove the oldest entries to keep only the latest 20
      const oldestEntries = await History.find({ userId: userObjectId })
        .sort({ listenedAt: 1 }) // Sort by oldest first
        .limit(historyCount - 20); // Get the excess entries

      const oldestIds = oldestEntries.map((entry) => entry._id);

      // Delete the oldest entries
      await History.deleteMany({ _id: { $in: oldestIds } });
    }

    res.status(201).json({ message: "Song added to history" });

    // Emit real-time update to the user via socket.io
    if (req.app && req.app.get && req.app.get("io")) {
      req.app.get("io").to(userId.toString()).emit("history_updated", { userId: userId.toString() });
    }
  } catch (error) {
    next(error);
  }
};