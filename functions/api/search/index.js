import { jsonResponse, errorResponse } from '../utils';

// GET /api/search?q=...
export const onRequestGet = async ({ request, env }) => {
    try {
        const url = new URL(request.url);
        const query = url.searchParams.get('q');

        if (!query || query.length < 2) {
            return jsonResponse([]);
        }

        // Simple SQL Search (Title & Excerpt)
        // For "Masterpiece" quality with D1, we can use FTS5 if enabled, or simple LIKE for now.
        // Let's assume standard LIKE for compatibility.
        const sql = `
            SELECT p.id, p.title, p.slug, p.excerpt, p.published_at, u.name as author_name, u.avatar_r2_key as author_avatar
            FROM posts p
            JOIN users u ON p.author_id = u.id
            WHERE p.status = 'published' 
            AND (p.title LIKE ? OR p.excerpt LIKE ?)
            ORDER BY p.published_at DESC
            LIMIT 20
        `;

        const searchTerm = `%${query}%`;
        const { results } = await env.DB.prepare(sql).bind(searchTerm, searchTerm).all();

        return jsonResponse(results);

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
