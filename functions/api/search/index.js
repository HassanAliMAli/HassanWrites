import { jsonResponse, errorResponse } from '../utils';

export const onRequestGet = async ({ request, env }) => {
    try {
        const url = new URL(request.url);
        const query = url.searchParams.get('q');

        if (!query || query.length < 2) {
            return jsonResponse([]);
        }

        // Basic search using LIKE
        // In production, this should be replaced with a proper search index or Cloudflare Vectorize
        const searchQuery = `
            SELECT id, title, slug, excerpt, published_at, tags 
            FROM posts 
            WHERE status = 'published' 
            AND (title LIKE ? OR excerpt LIKE ? OR tags LIKE ?)
            ORDER BY published_at DESC
            LIMIT 20
        `;

        const searchTerm = `%${query}%`;
        const results = await env.DB.prepare(searchQuery)
            .bind(searchTerm, searchTerm, searchTerm)
            .all();

        return jsonResponse(results.results);

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
