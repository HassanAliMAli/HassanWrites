import { jsonResponse, errorResponse, verifyToken } from '../utils';

export const onRequestGet = async ({ request, env }) => {
    try {
        // Auth Check (Admin only)
        const cookie = request.headers.get('Cookie');
        const token = cookie?.split('auth_token=')[1]?.split(';')[0];
        if (!token) return errorResponse('Unauthorized', 401);

        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const user = await verifyToken(token, secret);
        if (!user || user.role !== 'admin') return errorResponse('Unauthorized', 403);

        // 1. Fetch Real-time Stats from DO
        const idObj = env.DASHBOARD_DO.idFromName('global');
        const stub = env.DASHBOARD_DO.get(idObj);
        const doRes = await stub.fetch('http://do/stats');
        const realTimeStats = await doRes.json();

        // 2. Fetch Historical Stats from D1
        const dbStats = await env.DB.prepare(`
            SELECT 
                (SELECT COUNT(*) FROM users) as total_users,
                (SELECT COUNT(*) FROM posts) as total_posts,
                (SELECT COUNT(*) FROM subscriptions WHERE status = 'active') as active_subs,
                (SELECT COUNT(*) FROM impressions) as total_impressions
        `).first();

        return jsonResponse({
            realTime: realTimeStats,
            historical: dbStats
        });

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
