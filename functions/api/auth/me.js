import { jsonResponse, errorResponse, verifyToken } from '../utils';

export const onRequestGet = async ({ request, env }) => {
    try {
        const cookie = request.headers.get('Cookie');
        const token = cookie?.split('session=')[1]?.split(';')[0];

        if (!token) {
            return errorResponse('Not authenticated', 401);
        }

        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const user = await verifyToken(token, secret);

        if (!user) {
            return errorResponse('Invalid token', 401);
        }

        return jsonResponse({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar_r2_key: user.avatar_r2_key
        });
    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
