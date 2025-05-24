import { h } from 'snabbdom';
export function loginView(handleLogin, error) {
    let email = '';
    let password = '';
    const onSubmit = (e) => {
        e.preventDefault();
        handleLogin(email, password);
    };
    return h('div.login-container', [
        h('h2', 'Login to PST System'),
        h('form', { on: { submit: onSubmit } }, [
            h('input', {
                props: { type: 'email', placeholder: 'Email', required: true },
                on: { input: (e) => email = e.target.value }
            }),
            h('input', {
                props: { type: 'password', placeholder: 'Password', required: true },
                on: { input: (e) => password = e.target.value }
            }),
            h('button', { props: { type: 'submit' } }, 'Login'),
            error ? h('p.error', error) : null
        ])
    ]);
}
