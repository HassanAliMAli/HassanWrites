import { createSubscriberJWT } from '../utils/auth.js';

export async function onRequestGet(context) {
    const { request, env } = context;

    try {
        // Get token from query string
        const url = new URL(request.url);
        const token = url.searchParams.get('token');

        if (!token) {
            return new Response('Missing token', {
                status: 400,
                headers: { 'Content-Type': 'text/html' }
            });
        }

        // Look up token in database
        const magicLink = await env.DB.prepare(`
            SELECT * FROM magic_links WHERE token = ?
        `).bind(token).first();

        if (!magicLink) {
            return new Response('Invalid or expired link', {
                status: 400,
                headers: { 'Content-Type': 'text/html' }
            });
        }

        // Check if token is expired
        const now = Date.now();
        if (now > magicLink.expires_at) {
            return new Response('Link has expired. Please request a new one.', {
                status: 400,
                headers: { 'Content-Type': 'text/html' }
            });
        }

        // Check if token was already used
        if (magicLink.used === 1) {
            return new Response('This link has already been used', {
                status: 400,
                headers: { 'Content-Type': 'text/html' }
            });
        }

        // Get subscriber
        const subscriber = await env.DB.prepare(`
            SELECT * FROM subscribers WHERE id = ?
        `).bind(magicLink.subscriber_id).first();

        if (!subscriber) {
            return new Response('Subscriber not found', {
                status: 404,
                headers: { 'Content-Type': 'text/html' }
            });
        }

        // Check subscription is active
        if (subscriber.subscription_status !== 'active') {
            return new Response('Your subscription is not active', {
                status: 403,
                headers: { 'Content-Type': 'text/html' }
            });
        }

        // Mark token as used
        await env.DB.prepare(`
            UPDATE magic_links SET used = 1 WHERE token = ?
        `).bind(token).run();

        // Create JWT session token
        const jwt = await createSubscriberJWT(subscriber, env);

        // Create response with redirect and set cookie
        const redirectUrl = `${env.SITE_URL}/?welcome=true`;

        return new Response(null, {
            status: 302,
            headers: {
                'Location': redirectUrl,
                'Set-Cookie': `subscriber_session=${jwt}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000` // 30 days
            }
        });

    } catch (error) {
        console.error('Magic link verification error:', error);
        return new Response('An error occurred. Please try again.', {
            status: 500,
            headers: { 'Content-Type': 'text/html' }
        });
    }
}
