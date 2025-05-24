import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import Chat from './models/Chat.js'; // Adjust path based on your project structure

// Define type for ClientOptions to include puppeteer
interface ClientOptions {
  authStrategy: any;
  puppeteer?: {
    headless: boolean;
    args?: string[];
  };
}

// Define type for Chat document
interface ChatDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  contact: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isSent: boolean;
  isGroup?: boolean;
  _id: mongoose.Types.ObjectId;
}

let client: InstanceType<typeof Client>;

export function initWhatsApp(io: Server) {
  console.log('Initializing WhatsApp client...');
  client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] },
  } as ClientOptions);

  client.on('qr', (qr: string) => {
    console.log('QR Code generated:', qr);
    io.emit('qr', qr);
  });

  client.on('ready', () => {
    console.log('WhatsApp client connected successfully');
    io.emit('whatsapp-status', { connected: true });
  });

  client.on('disconnected', (reason: string) => {
    console.log('WhatsApp client disconnected:', reason);
    io.emit('whatsapp-status', { connected: false });
    // Type assertion to treat initialize as Promise<void>
    (client.initialize as () => Promise<void>)().catch((err: Error) =>
      console.error('Reconnect failed:', err)
    );
  });

  client.on('message', async (msg: any) => {
    try {
      console.log('Received message:', JSON.stringify(msg, null, 2));
      const chat = await msg.getChat();
      console.log('Chat details:', JSON.stringify(chat, null, 2));

      if (!msg.body || msg.body.trim() === '') {
        console.log('Skipping empty or non-text message from:', chat.id._serialized);
        return;
      }

      const existingChat = await Chat.findOne({
        contact: chat.id._serialized,
        message: msg.body,
        timestamp: {
          $gte: new Date(msg.timestamp * 1000 - 1000),
          $lte: new Date(msg.timestamp * 1000 + 1000),
        },
      });

      if (!existingChat) {
        const defaultUserId = process.env.DEFAULT_USER_ID;
        if (!defaultUserId) {
          console.error('Default userId not configured in .env');
          return;
        }

        const newChat = await Chat.create({
          userId: new mongoose.Types.ObjectId(defaultUserId),
          contact: chat.id._serialized,
          message: msg.body,
          timestamp: new Date(msg.timestamp * 1000),
          isRead: false,
          isSent: false,
          isGroup: chat.isGroup,
        }) as ChatDocument;

        console.log('New chat saved:', JSON.stringify(newChat, null, 2));
        io.emit('new-chat', {
          _id: newChat._id.toString(),
          contact: chat.id._serialized,
          message: msg.body,
          timestamp: newChat.timestamp.toISOString(),
          isRead: newChat.isRead,
          isSent: newChat.isSent,
          isGroup: newChat.isGroup,
        });
      } else {
        console.log('Duplicate chat ignored:', chat.id._serialized);
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });

  // Type assertion to treat initialize as Promise<void>
  (client.initialize as () => Promise<void>)().catch((err: Error) =>
    console.error('Error initializing WhatsApp client:', err)
  );
}

export async function sendMessage(contact: string, message: string, userId?: string) {
  try {
    if (!message || message.trim() === '') {
      console.log('Cannot send empty message to:', contact);
      return;
    }

    console.log('Sending message to:', contact, 'Message:', message);
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
      isRead: true,
      isGroup: contact.includes('@g.us'),
    }) as ChatDocument;

    console.log('Message sent and saved:', JSON.stringify(newChat, null, 2));
    return newChat;
  } catch (err) {
    console.error('Error sending message:', err);
    throw err;
  }
}

export function getWhatsAppClient(): InstanceType<typeof Client> {
  if (!client) {
    throw new Error('WhatsApp client not initialized');
  }
  return client;
}
