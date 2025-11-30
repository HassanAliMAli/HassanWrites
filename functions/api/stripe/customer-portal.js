
import Stripe from 'stripe';
import { jsonResponse, errorResponse, verifyToken } from '../utils.js';

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        // 1. Auth Check
        const cookie = request.headers.get('Cookie');
        const token = cookie?.split('auth_token=')[1]?.split(';')[0];
        if (!token) return errorResponse('Unauthorized', 401);

        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const user = await verifyToken(token, secret);
        if (!user) return errorResponse('Invalid token', 401);

        // 2. Get User's Stripe Customer ID
        const dbUser = await env.DB.prepare('SELECT stripe_customer_id FROM users WHERE id = ?').bind(user.sub).first();

        if (!dbUser || !dbUser.stripe_customer_id) {
            return errorResponse('No subscription found', 404);
        }

        // 3. Create Portal Session
        const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

        const session = await stripe.billingPortal.sessions.create({
            customer: dbUser.stripe_customer_id,
            return_url: `${new URL(request.url).origin}/membership`
        });

        return jsonResponse({ portalUrl: session.url });

    } catch (error) {
        console.error('Customer portal error:', error);
        return errorResponse(error.message, 500);
    }
}
