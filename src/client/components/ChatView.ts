import { h, VNode } from 'snabbdom';
import { Chat } from '../types';

export function chatView(
  messages: Chat[],
  contact: string,
  sendMessage: (contact: string, message: string) => void,
  setCurrentChat: (contact: string | null) => void,
  inputMessage: string,
  updateInput: (value: string) => void,
  update: () => void
): VNode {
  const scrollToBottom = (node: HTMLElement) => {
    node.scrollTop = node.scrollHeight; // Auto-scroll to bottom
  };

  return h('div.chat-view', [
    h('div.chat-header', [
      h('h2', contact),
      h('button', { on: { click: () => setCurrentChat(null) } }, 'Back')
    ]),
    h('div.chat-messages', {
      style: { display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: '0', flex: '1' },
      hook: {
        insert: (vnode: VNode) => scrollToBottom(vnode.elm as HTMLElement),
        update: (oldVnode: VNode, vnode: VNode) => scrollToBottom(vnode.elm as HTMLElement)
      }
    }, [
      h('div', messages.map(msg =>
        h('div.message', {
          class: { sent: msg.isSent, received: !msg.isSent },
          style: { marginBottom: '10px' }
        }, [
          h('span', msg.message),
          h('small', new Date(msg.timestamp).toLocaleString())
        ])
      ))
    ]),
    h('form.message-input', { on: { submit: (e: Event) => {
      e.preventDefault();
      if (inputMessage.trim()) {
        sendMessage(contact, inputMessage);
      }
    } } }, [
      h('input', {
        props: { type: 'text', placeholder: 'Type a message...', value: inputMessage },
        on: { input: (e: Event) => { updateInput((e.target as HTMLInputElement).value); update(); } }
      }),
      h('button', { props: { type: 'submit' } }, 'Send')
    ])
  ]);
}