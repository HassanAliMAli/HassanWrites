import Stripe from 'stripe';
import { getPriceIdFromTier } from '../utils/stripe.js';
import { jsonResponse } from '../utils.js';

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const { tier, email } = await request.json();

        // Validate input
        if (!tier || !email) {
            return jsonResponse({ error: 'Missing tier or email' }, 400);
        }

        if (!['newsletter', 'premium'].includes(tier)) {
            return jsonResponse({ error: 'Invalid tier' }, 400);
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return jsonResponse({ error: 'Invalid email format' }, 400);
        }

        // Initialize Stripe
        const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
            apiVersion: '2023-10-16'
        });

        // Get price ID for the tier
        const priceId = getPriceIdFromTier(tier, env);
        if (!priceId) {
            return jsonResponse({ error: 'Invalid subscription tier configuration' }, 500);
        }

        // Create or retrieve customer
        let customer;
        const existingCustomers = await stripe.customers.list({
            email: email,
            limit: 1
        });

        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
        } else {
            customer = await stripe.customers.create({
                email: email,
                metadata: {
                    source: 'hassanwrites_subscription'
                }
            });
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customer.id,
            mode: 'subscription',
            line_items: [
                {
                    price: priceId,
                    quantity: 1
                }
            ],
            success_url: `${env.SITE_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${env.SITE_URL}/membership`,
            customer_update: {
                address: 'never'
            },
            billing_address_collection: 'auto',
            metadata: {
                tier: tier
            }
        });

        return jsonResponse({
            checkoutUrl: session.url,
            sessionId: session.id
        });

    } catch (error) {
        console.error('Stripe checkout error:', error);
        return jsonResponse({
            error: 'Failed to create checkout session',
            details: error.message
        }, 500);
    }
}
