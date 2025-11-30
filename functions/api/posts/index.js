import { jsonResponse, errorResponse, verifyToken } from '../utils';

export const onRequestGet = async ({ request, env }) => {
    try {
        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const offset = parseInt(url.searchParams.get('offset') || '0');
        const status = url.searchParams.get('status');

        const joinQuery = `
            SELECT p.*, u.name as author_name, u.avatar_r2_key as author_avatar 
            FROM posts p 
            JOIN users u ON p.author_id = u.id
            ${status ? 'WHERE p.status = ?' : ''}
            ORDER BY p.created_at DESC 
            LIMIT ? OFFSET ?
        `;

        const joinParams = status ? [status, limit, offset] : [limit, offset];
        const posts = await env.DB.prepare(joinQuery).bind(...joinParams).all();

        return jsonResponse(posts.results, 200, {
            'Cache-Control': 'public, max-age=60, stale-while-revalidate=600'
        });
    } catch (err) {
        return errorResponse(err.message, 500);
    }
};

export const onRequestPost = async ({ request, env }) => {
    try {
        const cookie = request.headers.get('Cookie');
        const token = cookie?.split('auth_token=')[1]?.split(';')[0];
        if (!token) return errorResponse('Unauthorized', 401);

        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const user = await verifyToken(token, secret);
        if (!user) return errorResponse('Invalid token', 401);

        const { title, slug, excerpt, tags, paywall } = await request.json();

        if (!title || !slug) return errorResponse('Title and Slug are required', 400);

        const id = crypto.randomUUID();
        const now = Math.floor(Date.now() / 1000);

        await env.DB.prepare(
            `INSERT INTO posts (id, author_id, title, slug, excerpt, tags, paywall, status, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)`
        ).bind(
            id,
            user.sub, // verifyToken returns payload with sub
            title,
            slug,
            excerpt || '',
            JSON.stringify(tags || []),
            paywall ? 1 : 0,
            now,
            now
        ).run();

        return jsonResponse({ success: true, id, slug });

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
