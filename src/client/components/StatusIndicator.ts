import { h } from 'snabbdom';
import { Status } from '../types';

export function statusView(status: Status & { qr: string; statusMessage: string; error: string }) {
  return h('div.status-container', {
    class: { error: !!status.error }
  }, [
    h('span.status-message', status.statusMessage),
    status.qr ? h('div.qr-container', []) : null
  ]);
}