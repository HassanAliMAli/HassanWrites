import { jsonResponse, errorResponse, verifyToken } from '../utils';

// PUT /api/posts/[id]
export const onRequestPut = async ({ request, env, params }) => {
    try {
        // 1. Auth Check
        const cookie = request.headers.get('Cookie');
        const token = cookie?.split('session=')[1]?.split(';')[0];
        if (!token) return errorResponse('Unauthorized', 401);

        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const user = await verifyToken(token, secret);
        if (!user) return errorResponse('Invalid token', 401);

        const { id } = params;
        const { title, excerpt, tags, coverImage } = await request.json();
        const now = Math.floor(Date.now() / 1000);

        // 2. Verify Ownership
        const post = await env.DB.prepare('SELECT author_id FROM posts WHERE id = ?').bind(id).first();
        if (!post) return errorResponse('Post not found', 404);
        if (post.author_id !== user.id && user.role !== 'admin') {
            return errorResponse('Forbidden', 403);
        }

        // 3. Update D1
        await env.DB.prepare(
            `UPDATE posts 
             SET title = ?, excerpt = ?, tags = ?, updated_at = ? 
             WHERE id = ?`
        ).bind(
            title,
            excerpt,
            JSON.stringify(tags || []),
            now,
            id
        ).run();

        return jsonResponse({ success: true });

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
