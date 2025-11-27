import { jsonResponse, errorResponse, verifyToken } from '../../api/utils';

export const onRequestGet = async ({ request, env }) => {
    try {
        // 1. Auth Check
        const cookie = request.headers.get('Cookie');
        const token = cookie?.split('session=')[1]?.split(';')[0];
        if (!token) return errorResponse('Unauthorized', 401);

        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const user = await verifyToken(token, secret);
        if (!user) return errorResponse('Invalid token', 401);

        // 2. Fetch Historical Stats from D1
        const now = Math.floor(Date.now() / 1000);
        const thirtyDaysAgo = now - (30 * 86400);

        const query = `
            SELECT 
                COUNT(*) as total_views,
                COUNT(DISTINCT visitor_id) as unique_visitors
            FROM analytics_events
            WHERE post_id IN (SELECT id FROM posts WHERE author_id = ?)
            AND created_at >= ?
        `;
        const historical = await env.DB.prepare(query).bind(user.id, thirtyDaysAgo).first();

        // 3. Fetch Earnings
        const earnings = await env.DB.prepare('SELECT wallet_balance FROM users WHERE id = ?').bind(user.id).first();

        // 4. Fetch Live Stats from DO (Optional, usually frontend connects directly via WS)
        // But we can proxy it here if needed. For now, we return the static/historical data
        // and let the frontend handle the WebSocket for live counts.

        return jsonResponse({
            views: historical.total_views,
            visitors: historical.unique_visitors,
            earnings: earnings.wallet_balance,
            period: '30d'
        });

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
