import { jsonResponse, errorResponse, verifyToken } from '../utils';

export const onRequestGet = async ({ request, env }) => {
    try {
        const cookie = request.headers.get('Cookie');
        const token = cookie?.split('session=')[1]?.split(';')[0];

        if (!token) {
            return errorResponse('Not authenticated', 401);
        }

        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const user = await verifyToken(token, secret);

        if (!user || user.role !== 'admin') {
            return errorResponse('Unauthorized', 403);
        }

        const users = await env.DB.prepare(
            'SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC'
        ).all();

        return jsonResponse(users.results);
    } catch (err) {
        return errorResponse(err.message, 500);
    }
};

export const onRequestPost = async ({ request, env }) => {
    try {
        const cookie = request.headers.get('Cookie');
        const token = cookie?.split('session=')[1]?.split(';')[0];

        if (!token) {
            return errorResponse('Not authenticated', 401);
        }

        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const user = await verifyToken(token, secret);

        if (!user || user.role !== 'admin') {
            return errorResponse('Unauthorized', 403);
        }

        const { email, name, role } = await request.json();

        if (!email || !name) {
            return errorResponse('Email and name are required', 400);
        }

        const userId = crypto.randomUUID();
        const now = Math.floor(Date.now() / 1000);

        await env.DB.prepare(
            'INSERT INTO users (id, email, name, role, created_at) VALUES (?, ?, ?, ?, ?)'
        ).bind(userId, email, name, role || 'reader', now).run();

        return jsonResponse({ success: true, id: userId });
    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
