import Stripe from 'stripe';
import { initializeStripe, verifyStripeWebhook, getTierFromPriceId, SUBSCRIPTION_STATUS } from '../utils/stripe.js';
import { sendWelcomeEmail, sendMagicLinkEmail, sendPaymentFailedEmail, sendSubscriptionCanceledEmail } from '../utils/email.js';

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const signature = verifyStripeWebhook(request, env);
        const body = await request.text();
        const stripe = new Stripe(initializeStripe(env), { apiVersion: '2023-10-16' });

        let event;
        try {
            event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            return new Response(`Webhook Error: ${err.message}`, { status: 400 });
        }

        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object, env);
                break;
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object, env);
                break;
            case 'invoice.payment_succeeded':
                await handlePaymentSucceeded(event.data.object, env);
                break;
            case 'invoice.payment_failed':
                await handlePaymentFailed(event.data.object, env);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Webhook error:', error);
        return new Response(`Webhook Error: ${error.message}`, { status: 500 });
    }
}

async function handleSubscriptionUpdated(subscription, env) {
    const { customer, status, items, current_period_end } = subscription;
    const priceId = items.data[0].price.id;
    const tier = getTierFromPriceId(priceId, env);
    const now = Date.now();

    // Update subscriber record
    await env.DB.prepare(`
        UPDATE subscribers 
        SET subscription_tier = ?, 
            subscription_status = ?, 
            current_period_end = ?,
            updated_at = ?
        WHERE stripe_customer_id = ?
    `).bind(tier, status, current_period_end, now, customer).run();



    // Send welcome email if new active subscription
    if (status === 'active') {
        // We need to fetch the user's email from the database
        const subscriber = await env.DB.prepare(`
            SELECT email, id FROM subscribers WHERE stripe_customer_id = ?
        `).bind(customer).first();

        if (subscriber) {
            // Check if this is a new subscription (created_at close to now) or just an update
            // For simplicity, we might just send magic link if they don't have a session?
            // Or just send a welcome email.
            await sendWelcomeEmail(subscriber.email, subscriber.name || 'Subscriber', env);
            await sendMagicLinkEmail(subscriber.id, subscriber.email, env);
        }
    }
}

async function handleSubscriptionDeleted(subscription, env) {
    const { customer } = subscription;
    const now = Date.now();

    // Update subscriber status to canceled
    await env.DB.prepare(`
        UPDATE subscribers 
        SET subscription_status = ?, 
            updated_at = ?
        WHERE stripe_customer_id = ?
    `).bind(SUBSCRIPTION_STATUS.CANCELED, now, customer).run();



    const subscriber = await env.DB.prepare(`
        SELECT email, name FROM subscribers WHERE stripe_customer_id = ?
    `).bind(customer).first();

    if (subscriber) {
        await sendSubscriptionCanceledEmail(subscriber.email, subscriber.name, env);
    }
}

async function handlePaymentSucceeded(invoice, env) {
    const { customer, subscription, period_end } = invoice;

    if (!subscription) return; // Skip non-subscription invoices

    const now = Date.now();

    // Update subscription period
    await env.DB.prepare(`
        UPDATE subscribers 
        SET current_period_end = ?,
            subscription_status = ?,
            updated_at = ?
        WHERE stripe_customer_id = ?
    `).bind(period_end, SUBSCRIPTION_STATUS.ACTIVE, now, customer).run();


}

async function handlePaymentFailed(invoice, env) {
    const { customer } = invoice;
    const now = Date.now();

    // Update status to past_due
    await env.DB.prepare(`
        UPDATE subscribers 
        SET subscription_status = ?,
            updated_at = ?
        WHERE stripe_customer_id = ?
    `).bind(SUBSCRIPTION_STATUS.PAST_DUE, now, customer).run();



    const subscriber = await env.DB.prepare(`
        SELECT email, name FROM subscribers WHERE stripe_customer_id = ?
    `).bind(customer).first();

    if (subscriber) {
        await sendPaymentFailedEmail(subscriber.email, subscriber.name, env);
    }
}
