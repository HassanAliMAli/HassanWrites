// JWT and authentication utilities for subscribers

import { SignJWT, jwtVerify } from 'jose';

// Generate secure random token for magic links
export function generateMagicToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

// Create JWT for subscriber session
export async function createSubscriberJWT(subscriber, env) {
    const secret = new TextEncoder().encode(env.JWT_SECRET);

    const token = await new SignJWT({
        subscriber_id: subscriber.id,
        email: subscriber.email,
        tier: subscriber.subscription_tier,
        type: 'subscriber'
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('30d')  // 30 days
        .sign(secret);

    return token;
}

// Verify subscriber JWT
export async function verifySubscriberJWT(token, env) {
    try {
        const secret = new TextEncoder().encode(env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        if (payload.type !== 'subscriber') {
            return null;
        }

        return payload;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}

// Extract JWT from cookie
export function getSubscriberFromCookie(request) {
    const cookies = request.headers.get('cookie') || '';
    const sessionCookie = cookies.split(';').find(c => c.trim().startsWith('subscriber_session='));

    if (!sessionCookie) {
        return null;
    }

    return sessionCookie.split('=')[1];
}

// Validate subscriber session and check subscription status
export async function validateSubscriberSession(request, env) {
    const token = getSubscriberFromCookie(request);

    if (!token) {
        return null;
    }

    const payload = await verifySubscriberJWT(token, env);

    if (!payload) {
        return null;
    }

    // Check subscription is still active in database
    const subscriber = await env.DB.prepare(`
        SELECT * FROM subscribers WHERE id = ? AND subscription_status = 'active'
    `).bind(payload.subscriber_id).first();

    return subscriber;
}

// Check if subscriber has access to premium content based on tier
export function hasAccessToContent(subscriber, contentTier) {
    if (!subscriber) {
        return false;
    }

    // Premium tier has access to everything
    if (subscriber.subscription_tier === 'premium') {
        return true;
    }

    // Newsletter tier only has access to newsletter content
    if (subscriber.subscription_tier === 'newsletter' && contentTier === 'newsletter') {
        return true;
    }

    return false;
}
