import { jsonResponse, errorResponse, verifyToken } from '../utils';

export const onRequestDelete = async ({ request, env, params }) => {
    try {
        const cookie = request.headers.get('Cookie');
        const token = cookie?.split('session=')[1]?.split(';')[0];

        if (!token) {
            return errorResponse('Not authenticated', 401);
        }

        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const user = await verifyToken(token, secret);

        if (!user || user.role !== 'admin') {
            return errorResponse('Unauthorized', 403);
        }

        const { id } = params;

        await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();

        return jsonResponse({ success: true });
    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
