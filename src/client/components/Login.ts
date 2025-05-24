import { h } from 'snabbdom';

export function loginView(handleLogin: (email: string, password: string) => void, error?: string) {
  let email = '';
  let password = '';

  const onSubmit = (e: Event) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return h('div.login-container', [
    h('h2', 'Login to PST System'),
    h('form', { on: { submit: onSubmit } }, [
      h('input', {
        props: { type: 'email', placeholder: 'Email', required: true },
        on: { input: (e: Event) => email = (e.target as HTMLInputElement).value }
      }),
      h('input', {
        props: { type: 'password', placeholder: 'Password', required: true },
        on: { input: (e: Event) => password = (e.target as HTMLInputElement).value }
      }),
      h('button', { props: { type: 'submit' } }, 'Login'),
      error ? h('p.error', error) : null
    ])
  ]);
}