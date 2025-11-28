
import { generateMagicToken } from '../utils/auth.js';
import { jsonResponse } from '../utils.js';

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const { subscriber_id, email } = await request.json();

        if (!subscriber_id || !email) {
            return jsonResponse({ error: 'Missing subscriber_id or email' }, 400);
        }

        // Verify subscriber exists and is active
        const subscriber = await env.DB.prepare(`
            SELECT * FROM subscribers WHERE id = ? AND subscription_status = 'active'
        `).bind(subscriber_id).first();

        if (!subscriber) {
            return jsonResponse({ error: 'Subscriber not found or inactive' }, 404);
        }

        // Generate secure token
        const token = generateMagicToken();
        const now = Date.now();
        const expiresAt = now + (60 * 60 * 1000); // 1 hour from now

        // Store token in database
        await env.DB.prepare(`
            INSERT INTO magic_links (token, subscriber_id, expires_at, used, created_at)
            VALUES (?, ?, ?, 0, ?)
        `).bind(token, subscriber_id, expiresAt, now).run();

        // Create magic link URL
        const magicLink = `${env.SITE_URL}/auth/verify?token=${token}`;

        // TODO: Send email with magic link


        // For now, return the link (in production, email it and return success)
        return jsonResponse({
            success: true,
            message: 'Magic link sent to email',
            // Remove this in production:
            magicLink: magicLink
        });

    } catch (error) {
        console.error('Send magic link error:', error);
        return jsonResponse({
            error: 'Failed to send magic link',
            details: error.message
        }, 500);
    }
}
