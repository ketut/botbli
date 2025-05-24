import mongoose, { Schema, Document } from 'mongoose';

interface ChatDocument extends Document {
  userId: mongoose.Types.ObjectId;
  contact: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isSent: boolean;
  isGroup?: boolean;
  _id: mongoose.Types.ObjectId;
}

const chatSchema = new Schema<ChatDocument>({
  userId: { type: Schema.Types.ObjectId, required: true },
  contact: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true },
  isRead: { type: Boolean, default: false },
  isSent: { type: Boolean, default: false },
  isGroup: { type: Boolean, default: false },
});

export default mongoose.model<ChatDocument>('Chat', chatSchema);