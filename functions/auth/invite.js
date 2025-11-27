import { jsonResponse, errorResponse, generateToken } from '../api/utils';

export const onRequestPost = async ({ request, env }) => {
    try {
        const { token, email, name } = await request.json();

        if (!token || !email || !name) {
            return errorResponse('Token, Email, and Name are required', 400);
        }

        // 1. Validate Invite Token against D1
        const invite = await env.DB.prepare('SELECT * FROM invites WHERE token = ?').bind(token).first();

        if (!invite) {
            return errorResponse('Invalid invite token', 403);
        }

        // Check Expiry
        if (invite.expires_at && Date.now() / 1000 > invite.expires_at) {
            return errorResponse('Invite token expired', 403);
        }

        // Check Usage
        if (invite.uses >= invite.max_uses) {
            return errorResponse('Invite token fully used', 403);
        }

        // 2. Check if user exists
        const existingUser = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
        if (existingUser) {
            return errorResponse('User already exists', 409);
        }

        // 3. Create User in D1
        const userId = crypto.randomUUID();
        const role = invite.role || 'author';

        // Transaction: Create User + Increment Invite Use
        await env.DB.batch([
            env.DB.prepare(
                'INSERT INTO users (id, email, name, role) VALUES (?, ?, ?, ?)'
            ).bind(userId, email, name, role),
            env.DB.prepare(
                'UPDATE invites SET uses = uses + 1 WHERE id = ?'
            ).bind(invite.id)
        ]);

        // 4. Generate Session Token
        // Use env.JWT_SECRET (ensure this is set in Cloudflare Dashboard / .dev.vars)
        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const sessionToken = await generateToken({ id: userId, email, role }, secret);

        // 5. Return Success + Cookie
        const response = jsonResponse({ success: true, user: { id: userId, email, name, role } });

        // Set HttpOnly Cookie
        response.headers.append('Set-Cookie', `session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`);

        return response;

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
