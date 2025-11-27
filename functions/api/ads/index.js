import { jsonResponse, errorResponse, verifyToken } from '../utils';

// POST /api/ads
export const onRequestPost = async ({ request, env }) => {
    try {
        // 1. Auth Check
        const cookie = request.headers.get('Cookie');
        const token = cookie?.split('session=')[1]?.split(';')[0];
        if (!token) return errorResponse('Unauthorized', 401);

        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const user = await verifyToken(token, secret);
        if (!user || user.role !== 'admin') return errorResponse('Forbidden: Admins only', 403);

        const { type, creative_r2_key, targeting, priority, budget, start_at, end_at } = await request.json();

        if (!type || !priority) {
            return errorResponse('Type and Priority are required', 400);
        }

        const id = crypto.randomUUID();
        const now = Math.floor(Date.now() / 1000);

        await env.DB.prepare(
            `INSERT INTO ads (id, type, creative_r2_key, targeting_json, priority, budget, start_at, end_at, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            id,
            type,
            creative_r2_key || null,
            JSON.stringify(targeting || {}),
            priority,
            budget || 0,
            start_at || now,
            end_at || null,
            now
        ).run();

        return jsonResponse({ success: true, id });

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
