import { errorResponse, generateToken } from '../api/utils';

export const onRequestGet = async ({ request, env }) => {
    try {
        const url = new URL(request.url);
        const token = url.searchParams.get('token');

        if (!token) return errorResponse('Token required', 400);

        // 1. Verify Magic Link Token
        const link = await env.DB.prepare(`
            SELECT * FROM magic_links WHERE token = ? AND used = 0 AND expires_at > ?
        `).bind(token, Date.now()).first();

        if (!link) {
            return errorResponse('Invalid or expired token', 401);
        }

        // 2. Get User
        const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(link.user_id).first();
        if (!user) {
            return errorResponse('User not found', 404);
        }

        // 3. Mark token as used
        await env.DB.prepare('UPDATE magic_links SET used = 1 WHERE token = ?').bind(token).run();

        // 4. Generate Session JWT
        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const sessionToken = await generateToken({ id: user.id, email: user.email, role: user.role }, secret);

        // 5. Redirect to Dashboard with Cookie
        const headers = new Headers();
        headers.append('Set-Cookie', `session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`);
        headers.append('Location', '/');

        return new Response(null, {
            status: 302,
            headers
        });

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
