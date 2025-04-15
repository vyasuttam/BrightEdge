import mongoose, { Schema } from "mongoose";

const userProgressSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    course_id: {
      type: Schema.Types.ObjectId,
      ref: 'course',
      required: true
    },
    content_id: {
      type: Schema.Types.ObjectId,
      ref: 'section_content',
      required: true
    },
    is_completed: {
      type: Boolean,
      default: false
    },
    current_position: { // For resuming videos
      type: Number, // In seconds
      default: 0
    },
    completed_at: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export const UserProgress = mongoose.model('user_progress', userProgressSchema);
