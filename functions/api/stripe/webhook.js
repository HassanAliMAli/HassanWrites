import Stripe from 'stripe';
import { initializeStripe, verifyStripeWebhook, SUBSCRIPTION_STATUS } from '../utils/stripe.js';
import { sendWelcomeEmail, sendPaymentFailedEmail, sendSubscriptionCanceledEmail } from '../utils/email.js';

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
                // Silently ignore unhandled event types
                break;
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
    const { customer, status, current_period_end, id: subscriptionId } = subscription;
    const now = Date.now();

    // 1. Find user by stripe_customer_id
    const user = await env.DB.prepare('SELECT id, email, name FROM users WHERE stripe_customer_id = ?').bind(customer).first();

    if (!user) {
        console.error(`User not found for customer ${customer}`);
        return;
    }

    // 2. Upsert subscription
    await env.DB.prepare(`
        INSERT INTO subscriptions (user_id, stripe_subscription_id, status, current_period_end, created_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            stripe_subscription_id = excluded.stripe_subscription_id,
            status = excluded.status,
            current_period_end = excluded.current_period_end
    `).bind(user.id, subscriptionId, status, current_period_end, Math.floor(now / 1000)).run();

    // Send welcome email if new active subscription
    if (status === 'active') {
        // Check if we should send welcome email (maybe check if created_at is recent?)
        // For now, let's just send it.
        await sendWelcomeEmail(user.email, user.name || 'Subscriber', env);
        // await sendMagicLinkEmail(user.email, ..., env); // Magic link needs token generation
    }
}

async function handleSubscriptionDeleted(subscription, env) {
    const { customer } = subscription;

    const user = await env.DB.prepare('SELECT id, email, name FROM users WHERE stripe_customer_id = ?').bind(customer).first();
    if (!user) return;

    // Update status to canceled
    await env.DB.prepare(`
        UPDATE subscriptions 
        SET status = ?
        WHERE user_id = ?
    `).bind(SUBSCRIPTION_STATUS.CANCELED, user.id).run();

    await sendSubscriptionCanceledEmail(user.email, env);
}

async function handlePaymentSucceeded(invoice, env) {
    const { customer, subscription, period_end } = invoice;
    if (!subscription) return;

    const user = await env.DB.prepare('SELECT id FROM users WHERE stripe_customer_id = ?').bind(customer).first();
    if (!user) return;

    await env.DB.prepare(`
        UPDATE subscriptions 
        SET current_period_end = ?,
            status = ?
        WHERE user_id = ?
    `).bind(period_end, SUBSCRIPTION_STATUS.ACTIVE, user.id).run();
}

async function handlePaymentFailed(invoice, env) {
    const { customer } = invoice;

    const user = await env.DB.prepare('SELECT id, email, name FROM users WHERE stripe_customer_id = ?').bind(customer).first();
    if (!user) return;

    await env.DB.prepare(`
        UPDATE subscriptions 
        SET status = ?
        WHERE user_id = ?
    `).bind(SUBSCRIPTION_STATUS.PAST_DUE, user.id).run();

    await sendPaymentFailedEmail(user.email, env); // Removed portalLink for now as we need to generate it
}
