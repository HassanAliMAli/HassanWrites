import { jsonResponse, errorResponse, verifyToken } from '../../utils';

// POST /api/editor/session/[id] - REST Save Fallback
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
        const { title, blocks } = await request.json();

        // 2. Forward to Durable Object via HTTP
        // The DO `fetch` method handles GET (read) and we can add POST (write) support there.
        // But wait, our DO `fetch` currently only handles GET and Upgrade.
        // We need to update the DO to handle POST if we want to use it as the source of truth.

        // Alternatively, we can write directly to D1/Storage here, but that might cause race conditions with the DO.
        // BEST PRACTICE: Route everything through the DO.

        const url = new URL(request.url);
        url.pathname = `/session/${id}`;

        // We need to modify the request to be a POST that the DO understands, or ensure the DO handles it.
        // Let's assume we update the DO to handle POST.

        const response = await env.BACKEND.fetch(url.toString(), request);
        return response;

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
