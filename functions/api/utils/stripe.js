// Stripe utility functions

export function initializeStripe(env) {
    if (!env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not set');
    }

    // Stripe SDK will be imported in the endpoint files
    return env.STRIPE_SECRET_KEY;
}

export function verifyStripeWebhook(request, env) {
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
        throw new Error('Missing stripe-signature header');
    }

    // Webhook verification will be done in the webhook endpoint
    return signature;
}

export const SUBSCRIPTION_TIERS = {
    NEWSLETTER: 'newsletter',
    PREMIUM: 'premium'
};

export const SUBSCRIPTION_STATUS = {
    ACTIVE: 'active',
    CANCELED: 'canceled',
    PAST_DUE: 'past_due',
    UNPAID: 'unpaid'
};

export function getTierFromPriceId(priceId, env) {
    if (priceId === env.STRIPE_PRICE_ID_NEWSLETTER) {
        return SUBSCRIPTION_TIERS.NEWSLETTER;
    } else if (priceId === env.STRIPE_PRICE_ID_PREMIUM) {
        return SUBSCRIPTION_TIERS.PREMIUM;
    }
    return null;
}

export function getPriceIdFromTier(tier, env) {
    if (tier === SUBSCRIPTION_TIERS.NEWSLETTER) {
        return env.STRIPE_PRICE_ID_NEWSLETTER;
    } else if (tier === SUBSCRIPTION_TIERS.PREMIUM) {
        return env.STRIPE_PRICE_ID_PREMIUM;
    }
    return null;
}
