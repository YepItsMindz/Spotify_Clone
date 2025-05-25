import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId for referencing the User model
      ref: 'User', // Reference the User model
      required: true,
    },
    songId: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId for referencing the Song model
      ref: 'Song', // Reference the Song model
      required: true,
    },
    listenedAt: {
      type: Date,
      default: Date.now, // Automatically set the current date and time
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

export const History = mongoose.model('History', historySchema);