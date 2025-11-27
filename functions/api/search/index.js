import { jsonResponse, errorResponse } from '../utils';

export const onRequestGet = async ({ request, env }) => {
    try {
        const url = new URL(request.url);
        const q = url.searchParams.get('q');

        if (!q || q.length < 2) return jsonResponse([]);

        // 1. Search Posts (Simple LIKE query for Phase 2)
        // Phase 3: Move to Vector Search or specialized search engine
        const query = `
            SELECT id, title, slug, excerpt, created_at 
            FROM posts 
            WHERE status = 'published' 
            AND (title LIKE ? OR excerpt LIKE ?) 
            ORDER BY created_at DESC 
            LIMIT 10
        `;
        const pattern = `%${q}%`;
        const results = await env.DB.prepare(query).bind(pattern, pattern).all();

        return jsonResponse(results.results);

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
