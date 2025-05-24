declare module 'whatsapp-web.js' {
  // Interfaces for type annotations
  export interface ClientInterface {
    on(event: string, callback: (...args: any[]) => void): void;
    initialize(): void;
    sendMessage(contact: string, message: string): Promise<any>;
    getChat(): Promise<any>;
  }

  export interface LocalAuthInterface {
    // Constructor is minimal; no methods needed
  }

  export interface MessageInterface {
    body: string;
    timestamp: number;
    getChat(): Promise<any>;
  }

  // Constructors for value usage
  export const Client: {
    new (options?: { authStrategy: any }): ClientInterface;
  };

  export const LocalAuth: {
    new (): LocalAuthInterface;
  };

  // Message is an interface, not a constructor
  export type MessageType = MessageInterface;

  // Default export for destructuring
  interface WhatsAppModule {
    Client: typeof Client;
    LocalAuth: typeof LocalAuth;
    Message: MessageType;
  }

  const _default: WhatsAppModule;
  export default _default;

  // Explicitly export interfaces for type imports
  export { ClientInterface, LocalAuthInterface, MessageInterface };
}