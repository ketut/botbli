import { Router, Request, Response } from 'express';
import Chat from '../models/Chat.js';
import authMiddleware from '../middleware/auth.js';
import { getWhatsAppClient, sendMessage } from '../whatsapp.js';

// Definisikan tipe kustom buat bypass error getChatById
interface WhatsAppClient {
  getChatById(contact: string): Promise<{ id: { _serialized: string }; isGroup: boolean } | null>;
  sendMessage(contact: string, message: string): Promise<void>;
}

const router: Router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const chats = await Chat.find({ userId: req.user?.id }).sort({ timestamp: -1 });
    const waClient = getWhatsAppClient() as unknown as WhatsAppClient;
    const enrichedChats = await Promise.all(
      chats.map(async (chat) => {
        const waChat = await waClient.getChatById(chat.contact).catch(() => null);
        return {
          ...chat.toObject(),
          isGroup: waChat?.isGroup || chat.isGroup || false,
        };
      })
    );
    res.json(enrichedChats);
  } catch (err) {
    console.error('Error fetching chats:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:contact', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { contact } = req.params;
    const chats = await Chat.find({ contact, userId: req.user?.id }).sort({ timestamp: 1 });
    const waClient = getWhatsAppClient() as unknown as WhatsAppClient;
    const waChat = await waClient.getChatById(contact).catch(() => null);
    const enrichedChats = chats.map((chat) => ({
      ...chat.toObject(),
      isGroup: waChat?.isGroup || chat.isGroup || false,
    }));
    res.json(enrichedChats);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { contact, message } = req.body;
    if (!contact || !message) {
      return res.status(400).json({ error: 'Contact and message are required' });
    }
    const newChat = await sendMessage(contact, message, req.user?.id);
    if (!newChat) {
      return res.status(500).json({ error: 'Failed to send message' });
    }
    res.status(201).json(newChat);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;