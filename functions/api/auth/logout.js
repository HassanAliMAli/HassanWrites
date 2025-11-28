import { jsonResponse } from

    '../utils';

export const onRequestPost = async ({ request }) => {
    const headers = new Headers();
    headers.append('Set-Cookie', 'session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict');

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...headers, 'Content-Type': 'application/json' }
    });
};
