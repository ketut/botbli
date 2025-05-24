import './styles.css';
import { init, h, VNode, classModule, propsModule, eventListenersModule, styleModule } from 'snabbdom';
import { io } from 'socket.io-client';
import axios from 'axios';
import QRCode from 'qrcode';
import { loginView } from './components/Login';
import { statusView } from './components/StatusIndicator';
import { chatListView } from './components/ChatList';
import { chatView } from './components/ChatView';
import { Chat, Status, AuthResponse, ValidateResponse } from './types';

const patch = init([classModule, propsModule, eventListenersModule, styleModule]);

let state: {
  token: string | null;
  email: string | null;
  name: string | null;
  chats: Chat[];
  currentChat: string | null;
  messages: Chat[];
  status: Status;
  qr: string;
  statusMessage: string;
  error: string;
  inputMessage: string;
} = {
  token: null,
  email: null,
  name: null,
  chats: [],
  currentChat: null,
  messages: [],
  status: { connected: false },
  qr: '',
  statusMessage: 'Connecting to WhatsApp...',
  error: '',
  inputMessage: ''
};

const socket = io('http://localhost:4000', {
  withCredentials: true
});

socket.on('whatsapp-status', (data: Status) => {
  state.status = data;
  state.statusMessage = data.connected ? 'Connected to WhatsApp' : 'Disconnected, reconnecting...';
  state.error = data.error || data.reason || '';
  state.qr = data.connected ? '' : state.qr;
  console.log('WhatsApp status:', data);
  update();
});

socket.on('new-chat', (chat: Chat) => {
  if (!state.chats.some(c => c._id === chat._id)) {
    state.chats = [chat, ...state.chats];
    if (state.currentChat === chat.contact) {
      state.messages = [...state.messages, chat].sort((a: Chat, b: Chat) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
    console.log('New chat received:', chat);
    update();
  }
});

socket.on('qr', (qr: string) => {
  state.qr = qr;
  state.statusMessage = 'Awaiting QR code scan...';
  state.error = '';
  console.log('QR Code:', qr);
  const canvas = document.createElement('canvas');
  QRCode.toCanvas(canvas, qr, { errorCorrectionLevel: 'H' }, (err: Error | null | undefined) => {
    if (err) console.error('QR Code error:', err);
    const qrContainer = document.getElementById('qr-container');
    if (qrContainer) {
      qrContainer.innerHTML = '';
      qrContainer.appendChild(canvas);
    }
  });
  update();
});

const app = document.getElementById('app')!;
let oldVNode: VNode | Element = app;

const update = () => {
  const view = state.token
    ? h('div.app-container', [
        h('div.sidebar', [
          chatListView(state.chats, setCurrentChat, logout, state.name || '')
        ]),
        h('div.main-content', [
          statusView({ ...state.status, qr: state.qr, statusMessage: state.statusMessage, error: state.error }),
          h('div#qr-container.qr-container'),
          state.currentChat
            ? chatView(
                state.messages,
                state.currentChat,
                sendMessage,
                setCurrentChat,
                state.inputMessage,
                (value: string) => { state.inputMessage = value; },
                update
              )
            : h('div', { style: { textAlign: 'center', padding: '20px' } }, 'Select a chat to start messaging')
        ])
      ])
    : loginView(handleLogin, state.error);
  oldVNode = patch(oldVNode, view);
};

async function handleLogin(email: string, password: string) {
  try {
    const res = await axios.post<AuthResponse>('http://localhost:4000/auth/login', { email, password }, { timeout: 5000 });
    state.token = res.data.token;
    state.email = res.data.email;
    state.name = res.data.email.split('@')[0];
    localStorage.setItem('authToken', state.token);
    const chats = await axios.get<Chat[]>('http://localhost:4000/chats', {
      headers: { Authorization: `Bearer ${state.token}` }
    });
    state.chats = Array.from(new Map(chats.data.map((chat: Chat) => [chat._id, chat])).values());
    state.statusMessage = state.status.connected ? 'Connected to WhatsApp' : 'Connecting to WhatsApp...';
    state.error = '';
    console.log('Login successful, chats:', state.chats);
    update();
  } catch (err) {
    console.error('Login failed:', err);
    state.error = 'Invalid credentials';
    update();
  }
}

async function validateToken() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    state.token = null;
    state.email = null;
    state.name = null;
    update();
    return;
  }

  try {
    const res = await axios.get<ValidateResponse>('http://localhost:4000/auth/validate', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.data.valid) {
      state.token = token;
      state.email = res.data.email || null;
      state.name = res.data.email ? res.data.email.split('@')[0] : null;
      const chats = await axios.get<Chat[]>('http://localhost:4000/chats', {
        headers: { Authorization: `Bearer ${state.token}` }
      });
      state.chats = Array.from(new Map(chats.data.map((chat: Chat) => [chat._id, chat])).values());
      state.statusMessage = state.status.connected ? 'Connected to WhatsApp' : 'Connecting to WhatsApp...';
      state.error = '';
      console.log('Token validated, chats:', state.chats);
    } else {
      localStorage.removeItem('authToken');
      state.token = null;
      state.email = null;
      state.name = null;
      state.error = 'Session expired. Please log in again.';
    }
  } catch (err) {
    console.error('Token validation failed:', err);
    localStorage.removeItem('authToken');
    state.token = null;
    state.email = null;
    state.name = null;
    state.error = 'Session expired. Please log in again.';
  }
  update();
}

function logout() {
  localStorage.removeItem('authToken');
  state.token = null;
  state.email = null;
  state.name = null;
  state.chats = [];
  state.currentChat = null;
  state.messages = [];
  state.inputMessage = '';
  state.error = 'Logged out successfully';
  update();
}

function setCurrentChat(contact: string | null) {
  state.currentChat = contact;
  state.inputMessage = '';
  if (contact) {
    axios.get(`http://localhost:4000/chats/${contact}`, {
      headers: { Authorization: `Bearer ${state.token}` }
    }).then(res => {
      state.messages = res.data.sort((a: Chat, b: Chat) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      console.log('Messages for', contact, ':', state.messages);
      update();
    }).catch(err => {
      console.error('Failed to fetch messages:', err);
      state.error = 'Failed to load messages';
      update();
    });
  } else {
    state.messages = [];
    update();
  }
}

async function sendMessage(contact: string, message: string) {
  try {
    if (!message || message.trim() === '') {
      console.log('Cannot send empty message');
      return;
    }
    const response = await axios.post('http://localhost:4000/chats', { contact, message }, {
      headers: { Authorization: `Bearer ${state.token}` }
    });
    const newMessage: Chat = {
      _id: response.data._id || '',
      contact,
      message,
      timestamp: new Date().toISOString(),
      isRead: true,
      isSent: true,
      isGroup: response.data.isGroup || false
    };
    state.messages = [...state.messages, newMessage].sort((a: Chat, b: Chat) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const chatIndex = state.chats.findIndex(c => c.contact === contact);
    if (chatIndex !== -1) {
      state.chats[chatIndex] = { ...state.chats[chatIndex], message, timestamp: new Date().toISOString(), isGroup: state.chats[chatIndex].isGroup };
    } else {
      state.chats = [newMessage, ...state.chats];
    }
    state.inputMessage = '';
    console.log('Message sent:', newMessage);
    update();
  } catch (err) {
    console.error('Failed to send message:', err);
    state.error = 'Failed to send message';
    update();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  validateToken();
});