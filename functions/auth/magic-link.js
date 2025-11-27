import { jsonResponse, errorResponse } from '../api/utils';

export const onRequestPost = async ({ request, env }) => {
    try {
        const { email } = await request.json();
        if (!email) return errorResponse('Email is required');

        const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();

        if (!user) {
            return errorResponse('User not found. This platform is invite-only.', 404);
        }

        return jsonResponse({ success: true, message: 'Magic link sent' });
    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
