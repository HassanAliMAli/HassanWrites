import { jsonResponse, errorResponse } from '../api/utils';
import { generateMagicToken } from '../api/utils/auth';
import { sendMagicLinkEmail } from '../api/utils/email';

export const onRequestPost = async ({ request, env }) => {
    try {
        const { email } = await request.json();
        if (!email) return errorResponse('Email is required');

        const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();

        if (!user) {
            return errorResponse('User not found. This platform is invite-only.', 404);
        }

        // Generate secure token
        const token = generateMagicToken();
        const now = Date.now();
        const expiresAt = now + (60 * 60 * 1000); // 1 hour

        // Store token
        await env.DB.prepare(`
            INSERT INTO magic_links (token, user_id, expires_at, used, created_at)
            VALUES (?, ?, ?, 0, ?)
        `).bind(token, user.id, expiresAt, now).run();

        // Send email
        const magicLink = `${env.SITE_URL}/auth/verify?token=${token}`;
        const emailResult = await sendMagicLinkEmail(email, magicLink, env);

        if (!emailResult.success) {
            console.error('Failed to send magic link email:', emailResult.error);
            return errorResponse('Failed to send magic link email', 500);
        }

        return jsonResponse({ success: true, message: 'Magic link sent' });
    } catch (err) {
        console.error('Magic link error:', err);
        return errorResponse(err.message, 500);
    }
};
