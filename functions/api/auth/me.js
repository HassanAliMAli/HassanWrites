import { jsonResponse, verifyToken } from '../utils.js';

export const onRequestGet = async (context) => {
    try {
        const { request, env } = context;

        // 1. Get Cookie
        const cookieHeader = request.headers.get('Cookie');
        if (!cookieHeader) {
            return jsonResponse({ user: null });
        }

        const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));
        const token = cookies['auth_token'];

        if (!token) {
            return jsonResponse({ user: null });
        }

        // 2. Verify Token
        const payload = await verifyToken(token, env.JWT_SECRET);
        if (!payload) {
            return jsonResponse({ user: null });
        }

        // 3. Fetch User
        const db = env.DB;
        const user = await db.prepare('SELECT id, email, name, role, avatar_r2_key, banner_r2_key, accent_color, stripe_customer_id FROM users WHERE id = ?').bind(payload.sub).first();

        if (!user) {
            return jsonResponse({ user: null });
        }

        return jsonResponse({ user });

    } catch (error) {
        console.error('Me error:', error);
        return jsonResponse({ user: null });
    }
};
