import { h } from 'snabbdom';
export function statusView(status) {
    return h('div.status-container', {
        class: { error: !!status.error }
    }, [
        h('span.status-message', status.statusMessage),
        status.qr ? h('div.qr-container', []) : null
    ]);
}
