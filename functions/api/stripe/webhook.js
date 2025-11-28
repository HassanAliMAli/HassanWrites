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

console.log(`Subscription updated for customer: ${customer}`);

    // TODO: Send update email if status changed to active
    // if (status === 'active') {
    //     await sendMagicLinkEmail(subscriberId, email, env);
    // }
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

    console.log(`Subscription canceled for customer: ${customer}`);

    // TODO: Send cancellation confirmation email
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

    console.log(`Payment succeeded for customer: ${customer}`);
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

    console.log(`Payment failed for customer: ${customer}`);

    // TODO: Send payment failed email
}
