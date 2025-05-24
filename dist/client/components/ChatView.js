import { h } from 'snabbdom';
export function chatView(messages, contact, sendMessage, setCurrentChat, inputMessage, updateInput, update) {
    const scrollToBottom = (node) => {
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
                insert: (vnode) => scrollToBottom(vnode.elm),
                update: (oldVnode, vnode) => scrollToBottom(vnode.elm)
            }
        }, [
            h('div', messages.map(msg => h('div.message', {
                class: { sent: msg.isSent, received: !msg.isSent },
                style: { marginBottom: '10px' }
            }, [
                h('span', msg.message),
                h('small', new Date(msg.timestamp).toLocaleString())
            ])))
        ]),
        h('form.message-input', { on: { submit: (e) => {
                    e.preventDefault();
                    if (inputMessage.trim()) {
                        sendMessage(contact, inputMessage);
                    }
                } } }, [
            h('input', {
                props: { type: 'text', placeholder: 'Type a message...', value: inputMessage },
                on: { input: (e) => { updateInput(e.target.value); update(); } }
            }),
            h('button', { props: { type: 'submit' } }, 'Send')
        ])
    ]);
}
