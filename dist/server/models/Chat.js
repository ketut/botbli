import mongoose, { Schema } from 'mongoose';
const chatSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    contact: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, required: true },
    isRead: { type: Boolean, default: false },
    isSent: { type: Boolean, default: false },
    isGroup: { type: Boolean, default: false },
});
export default mongoose.model('Chat', chatSchema);
