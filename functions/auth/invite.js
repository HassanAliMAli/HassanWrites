import { errorResponse, generateToken } from '../api/utils';

export const onRequestPost = async ({ request, env }) => {
    try {
        const { token, name, email } = await request.json();

        // 1. Verify Invite Token (Mocked for now, real app would check KV/D1)
        if (token !== 'valid-invite-token') {
            return errorResponse('Invalid or expired invite token', 403);
        }

        // 2. Check if email already registered
        const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
        if (existing) {
            return errorResponse('Email already registered', 400);
        }

        // 3. Create User
        const userId = crypto.randomUUID();
        const now = Math.floor(Date.now() / 1000);

        await env.DB.prepare(
            'INSERT INTO users (id, email, name, role, created_at) VALUES (?, ?, ?, ?, ?)'
        ).bind(userId, email, name, 'reader', now).run();

        // 4. Generate Session Token
        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const sessionToken = await generateToken({ id: userId, email, role: 'reader' }, secret);

        // 5. Return Success + Set Cookie
        const headers = new Headers();
        headers.append('Set-Cookie', `session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`);

        return new Response(JSON.stringify({ success: true, user: { id: userId, email, name } }), {
            status: 200,
            headers: { ...headers, 'Content-Type': 'application/json' }
        });

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
