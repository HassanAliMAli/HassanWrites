import { jsonResponse, errorResponse, verifyToken } from '../../utils';

// POST /api/posts/[id]/publish
export const onRequestPost = async ({ request, env, params }) => {
    try {
        // 1. Auth Check
        const cookie = request.headers.get('Cookie');
        const token = cookie?.split('session=')[1]?.split(';')[0];
        if (!token) return errorResponse('Unauthorized', 401);

        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const user = await verifyToken(token, secret);
        if (!user) return errorResponse('Invalid token', 401);

        const { id } = params;
        const { html } = await request.json(); // The final rendered HTML from the editor

        if (!html) return errorResponse('HTML content is required', 400);

        // 2. Verify Ownership
        const post = await env.DB.prepare('SELECT author_id, slug FROM posts WHERE id = ?').bind(id).first();
        if (!post) return errorResponse('Post not found', 404);
        if (post.author_id !== user.id && user.role !== 'admin') {
            return errorResponse('Forbidden', 403);
        }

        // 3. Upload to R2
        const r2Key = `posts/${post.slug}/index.html`;
        await env.MEDIA_BUCKET.put(r2Key, html, {
            httpMetadata: { contentType: 'text/html' }
        });

        // 4. Update D1 Status
        const now = Math.floor(Date.now() / 1000);
        await env.DB.prepare(
            `UPDATE posts 
             SET status = 'published', canonical_r2_key = ?, published_at = ?, updated_at = ? 
             WHERE id = ?`
        ).bind(
            r2Key,
            now,
            now,
            id
        ).run();

        return jsonResponse({ success: true, url: r2Key });

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
