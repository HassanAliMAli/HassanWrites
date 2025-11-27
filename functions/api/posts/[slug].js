import { jsonResponse, errorResponse } from '../utils';

// GET /api/posts/[slug]
export const onRequestGet = async ({ env, params }) => {
    try {
        const { slug } = params;

        // 1. Get Post Metadata from D1
        const query = `
            SELECT p.*, u.name as author_name, u.avatar_r2_key as author_avatar, u.bio as author_bio
            FROM posts p 
            JOIN users u ON p.author_id = u.id
            WHERE p.slug = ?
        `;
        const post = await env.DB.prepare(query).bind(slug).first();

        if (!post) return errorResponse('Post not found', 404);

        // 2. If published, fetch HTML content from R2
        let content = null;
        if (post.status === 'published' && post.canonical_r2_key) {
            const object = await env.MEDIA_BUCKET.get(post.canonical_r2_key);
            if (object) {
                content = await object.text();
            }
        }

        return jsonResponse({ ...post, content }, 200, {
            'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600'
        });

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
