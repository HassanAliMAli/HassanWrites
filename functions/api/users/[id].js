import { jsonResponse, errorResponse, verifyToken } from '../utils';

export const onRequestGet = async ({ env, params }) => {
    try {
        const { id } = params;

        // Fetch user profile (public info)
        const user = await env.DB.prepare(
            'SELECT id, name, role, avatar_r2_key, banner_r2_key, accent_color, bio, created_at FROM users WHERE id = ?'
        ).bind(id).first();

        if (!user) {
            return errorResponse('User not found', 404);
        }

        return jsonResponse(user);
    } catch (err) {
        return errorResponse(err.message, 500);
    }
};

export const onRequestPut = async ({ request, env, params }) => {
    try {
        const { id } = params;
        const cookie = request.headers.get('Cookie');
        const token = cookie?.split('auth_token=')[1]?.split(';')[0];

        if (!token) {
            return errorResponse('Not authenticated', 401);
        }

        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const user = await verifyToken(token, secret);

        // Allow update if user is admin OR user is updating themselves
        if (!user || (user.role !== 'admin' && user.sub !== id)) {
            return errorResponse('Unauthorized', 403);
        }

        const { name, bio, avatar_r2_key, banner_r2_key, accent_color } = await request.json();

        // Build update query
        let query = 'UPDATE users SET ';
        const queryParams = [];
        const updates = [];

        if (name !== undefined) {
            updates.push('name = ?');
            queryParams.push(name);
        }
        if (bio !== undefined) {
            updates.push('bio = ?');
            queryParams.push(bio);
        }
        if (avatar_r2_key !== undefined) {
            updates.push('avatar_r2_key = ?');
            queryParams.push(avatar_r2_key);
        }
        if (banner_r2_key !== undefined) {
            updates.push('banner_r2_key = ?');
            queryParams.push(banner_r2_key);
        }
        if (accent_color !== undefined) {
            updates.push('accent_color = ?');
            queryParams.push(accent_color);
        }

        if (updates.length === 0) {
            return jsonResponse({ success: true });
        }

        query += updates.join(', ') + ' WHERE id = ?';
        queryParams.push(id);

        await env.DB.prepare(query).bind(...queryParams).run();

        return jsonResponse({ success: true });
    } catch (err) {
        return errorResponse(err.message, 500);
    }
};

export const onRequestDelete = async ({ request, env, params }) => {
    try {
        const cookie = request.headers.get('Cookie');
        const token = cookie?.split('auth_token=')[1]?.split(';')[0];

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
