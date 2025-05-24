export interface Chat {
  _id: string;
  contact: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isSent: boolean;
  isGroup: boolean; // New field
}

export interface Status {
  connected: boolean;
  error?: string;
  reason?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
}

export interface ValidateResponse {
  valid: boolean;
  email?: string;
}