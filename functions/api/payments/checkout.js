import { jsonResponse, errorResponse, verifyToken } from '../utils';

// POST /api/payments/checkout
export const onRequestPost = async ({ request, env }) => {
    try {
        // 1. Auth Check
        const cookie = request.headers.get('Cookie');
        const token = cookie?.split('session=')[1]?.split(';')[0];
        if (!token) return errorResponse('Unauthorized', 401);

        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const user = await verifyToken(token, secret);
        if (!user) return errorResponse('Invalid token', 401);

        const { priceId, successUrl, cancelUrl } = await request.json();

        if (!priceId || !successUrl || !cancelUrl) {
            return errorResponse('Price ID, Success URL, and Cancel URL are required', 400);
        }

        if (!env.STRIPE_SECRET_KEY) {
            return errorResponse('Server Configuration Error: Missing Stripe Key', 500);
        }

        // 2. Create Stripe Checkout Session
        // Using fetch because we might not have the stripe package installed or want to keep it lightweight
        const stripeSession = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'payment_method_types[0]': 'card',
                'line_items[0][price]': priceId,
                'line_items[0][quantity]': '1',
                'mode': 'subscription', // or payment, depending on priceId
                'success_url': successUrl,
                'cancel_url': cancelUrl,
                'customer_email': user.email,
                'client_reference_id': user.id,
                'metadata[userId]': user.id
            })
        });

        const sessionData = await stripeSession.json();

        if (sessionData.error) {
            return errorResponse(`Stripe Error: ${sessionData.error.message}`, 400);
        }

        return jsonResponse({
            success: true,
            url: sessionData.url,
            sessionId: sessionData.id
        });

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
