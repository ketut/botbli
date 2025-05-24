import { h } from 'snabbdom';
import { Chat } from '../types';

export function chatListView(chats: Chat[], setCurrentChat: (contact: string | null) => void, logout: () => void, userName: string) {
  const groupChats = chats.filter(chat => chat.isGroup);
  const individualChats = chats.filter(chat => !chat.isGroup);

  return h('div', [
    h('div.sidebar-header', [
      h('h2', `Daftar Chat (${userName})`),
      h('button.logout-btn', { on: { click: logout } }, 'Logout')
    ]),
    h('div.chat-list', [
      h('h3', 'Groups'),
      groupChats.length === 0
        ? h('p', 'No group chats available')
        : h('ul', groupChats.map(chat =>
            h('li.chat-item', {
              on: { click: () => setCurrentChat(chat.contact) }
            }, [
              h('div.chat-avatar', chat.contact.charAt(0).toUpperCase()),
              h('div.chat-info', [
                h('strong', chat.contact),
                h('span', chat.message.length > 30 ? `${chat.message.substring(0, 27)}...` : chat.message),
                h('small', new Date(chat.timestamp).toLocaleString())
              ])
            ])
          )),
      h('h3', 'Individuals'),
      individualChats.length === 0
        ? h('p', 'No individual chats available')
        : h('ul', individualChats.map(chat =>
            h('li.chat-item', {
              on: { click: () => setCurrentChat(chat.contact) }
            }, [
              h('div.chat-avatar', chat.contact.charAt(0).toUpperCase()),
              h('div.chat-info', [
                h('strong', chat.contact),
                h('span', chat.message.length > 30 ? `${chat.message.substring(0, 27)}...` : chat.message),
                h('small', new Date(chat.timestamp).toLocaleString())
              ])
            ])
          ))
    ])
  ]);
}