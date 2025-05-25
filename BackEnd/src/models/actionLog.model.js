import mongoose from 'mongoose';

const actionLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: String, 
      required: true
    },
    action: {
      type: String, // The type of action performed (e.g., "CREATE", "UPDATE", "DELETE")
      required: true
    },
    description: {
      type: String, // A detailed description of the action
      required: true
    },
    performedAt: {
      type: Date, // The timestamp of when the action was performed
      default: Date.now,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

export const ActionLog = mongoose.model('ActionLog', actionLogSchema);