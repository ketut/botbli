import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import mongoose from 'mongoose';
import Chat from './models/Chat.js';
let client;
export function initWhatsApp(io) {
    client = new Client({ authStrategy: new LocalAuth() });
    client.on('qr', (qr) => {
        console.log('QR Code:', qr);
        io.emit('qr', qr);
    });
    client.on('ready', () => {
        console.log('Connected to WhatsApp');
        io.emit('whatsapp-status', { connected: true });
    });
    client.on('disconnected', () => {
        console.log('Disconnected from WhatsApp');
        io.emit('whatsapp-status', { connected: false });
    });
    client.on('message', async (msg) => {
        try {
            const chat = await msg.getChat();
            if (!msg.body || msg.body.trim() === '') {
                console.log('Skipping empty or non-text message from:', chat.id._serialized);
                return;
            }
            const existingChat = await Chat.findOne({
                contact: chat.id._serialized,
                message: msg.body,
                timestamp: new Date(msg.timestamp * 1000),
            });
            if (!existingChat) {
                const defaultUserId = process.env.DEFAULT_USER_ID;
                if (!defaultUserId) {
                    console.error('Default userId not configured');
                    return;
                }
                const newChat = await Chat.create({
                    userId: new mongoose.Types.ObjectId(defaultUserId),
                    contact: chat.id._serialized,
                    message: msg.body,
                    timestamp: new Date(msg.timestamp * 1000),
                    isRead: false,
                    isSent: false,
                });
                console.log('New chat saved:', newChat);
                io.emit('new-chat', {
                    _id: newChat._id.toString(),
                    contact: chat.id._serialized,
                    message: msg.body,
                    timestamp: new Date(msg.timestamp * 1000).toISOString(),
                    isRead: false,
                    isSent: false,
                });
            }
            else {
                console.log('Duplicate chat ignored:', chat.id._serialized);
            }
        }
        catch (err) {
            console.error('Error saving message:', err);
        }
    });
    client.initialize();
}
export async function sendMessage(contact, message, userId) {
    try {
        if (!message || message.trim() === '') {
            console.log('Cannot send empty message to:', contact);
            return;
        }
        await client.sendMessage(contact, message);
        const effectiveUserId = userId || process.env.DEFAULT_USER_ID;
        if (!effectiveUserId) {
            throw new Error('UserId not provided and default userId not configured');
        }
        const newChat = await Chat.create({
            userId: new mongoose.Types.ObjectId(effectiveUserId),
            contact,
            message,
            isSent: true,
            timestamp: new Date(),
        });
        console.log('Message sent and saved:', newChat);
        return newChat;
    }
    catch (err) {
        console.error('Error sending message:', err);
        throw err;
    }
}
export function getWhatsAppClient() {
    if (!client) {
        throw new Error('WhatsApp client not initialized');
    }
    return client;
}
