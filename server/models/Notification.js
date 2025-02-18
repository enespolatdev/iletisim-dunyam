import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "comment", "friend"],
      required: true,
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    read: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification; 