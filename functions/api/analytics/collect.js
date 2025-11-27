import { jsonResponse, errorResponse } from '../utils';

export const onRequestPost = async ({ request, env }) => {
    try {
        const { type, postId, meta } = await request.json();

        if (!type) return errorResponse('Event type required', 400);

        // 1. Get Visitor ID from Cookie or Header
        const cookie = request.headers.get('Cookie');
        let visitorId = cookie?.split('visitor=')[1]?.split(';')[0];

        if (!visitorId) {
            visitorId = crypto.randomUUID();
        }

        // 2. Get User ID if logged in
        // We won't verify token here to keep it fast, just store it if present or decode purely for ID
        // For strictness, we could verify, but analytics endpoints should be low latency.
        // Let's just store null for now if not easily accessible without verify overhead.
        const userId = null;

        // 3. Insert Event (Async/Fire-and-forget in real world, but await here for D1)
        // In high-scale, use Analytics Engine or Queue
        const id = crypto.randomUUID();
        const now = Math.floor(Date.now() / 1000);

        await env.DB.prepare(
            'INSERT INTO analytics_events (id, type, post_id, user_id, visitor_id, meta, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(
            id,
            type,
            postId || null,
            userId,
            visitorId,
            JSON.stringify(meta || {}),
            now
        ).run();

        // 4. Return Success + Set Visitor Cookie if new
        const headers = new Headers();
        if (!cookie?.includes('visitor=')) {
            headers.append('Set-Cookie', `visitor=${visitorId}; Path=/; Max-Age=31536000; SameSite=Lax`);
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { ...headers, 'Content-Type': 'application/json' }
        });

    } catch (err) {
        // Fail silently for analytics to not break UI? Or return error?
        // Better to log and return 200 or 500.
        console.error('Analytics Error:', err);
        return jsonResponse({ success: false }, 500);
    }
};
