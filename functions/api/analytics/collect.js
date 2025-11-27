import { jsonResponse, errorResponse } from '../utils';

export const onRequestPost = async ({ request, env }) => {
    try {
        const { type, postId, meta } = await request.json();

        if (!type) return errorResponse('Event type required', 400);

        const cookie = request.headers.get('Cookie');
        let visitorId = cookie?.split('visitor=')[1]?.split(';')[0];

        if (!visitorId) {
            visitorId = crypto.randomUUID();
        }

        const userId = null;

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

        const headers = new Headers();
        if (!cookie?.includes('visitor=')) {
            headers.append('Set-Cookie', `visitor=${visitorId}; Path=/; Max-Age=31536000; SameSite=Lax`);
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { ...headers, 'Content-Type': 'application/json' }
        });

    } catch {
        return jsonResponse({ success: false }, 500);
    }
};
