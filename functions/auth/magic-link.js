import { jsonResponse, errorResponse } from '../api/utils';

export const onRequestPost = async ({ request, env }) => {
    try {
        const { email } = await request.json();
        if (!email) return errorResponse('Email is required');

        // 1. Check if user exists
        const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();

        if (!user) {
            // In a real app, we might send an invite request or generic "check email" to prevent enumeration
            // For this invite-only platform, we'll just say "User not found" for now
            return errorResponse('User not found. This platform is invite-only.', 404);
        }

        // 2. Generate Magic Link Token (short-lived)
        // In a real app, store this in KV or D1 with expiration
        const token = crypto.randomUUID();

        // 3. Send Email (Mocked for now)
        console.log(`[Mock Email] Magic Link for ${email}: https://${request.headers.get('host')}/auth/verify?token=${token}`);

        return jsonResponse({ success: true, message: 'Magic link sent (check console)' });
    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
