import { jsonResponse, errorResponse, verifyToken } from '../../api/utils';

// POST /api/payouts/stripe/onboard
export const onRequestPost = async ({ request, env }) => {
    try {
        // 1. Auth Check
        const cookie = request.headers.get('Cookie');
        const token = cookie?.split('session=')[1]?.split(';')[0];
        if (!token) return errorResponse('Unauthorized', 401);

        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const user = await verifyToken(token, secret);
        if (!user) return errorResponse('Invalid token', 401);

        // 2. Create Stripe Connect Account (Mocked)
        // In real app: Call Stripe API to create Express account
        const stripeAccountId = `acct_mock_${crypto.randomUUID()}`;

        // 3. Save to DB
        await env.DB.prepare('UPDATE users SET stripe_account_id = ? WHERE id = ?')
            .bind(stripeAccountId, user.id)
            .run();

        // 4. Return Onboarding Link (Mocked)
        return jsonResponse({
            url: `https://connect.stripe.com/setup/mock/${stripeAccountId}`,
            success: true
        });

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};

// POST /api/payouts/withdraw
export const onRequestPut = async ({ request, env }) => { // Using PUT for action
    try {
        // 1. Auth Check
        const cookie = request.headers.get('Cookie');
        const token = cookie?.split('session=')[1]?.split(';')[0];
        if (!token) return errorResponse('Unauthorized', 401);

        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const user = await verifyToken(token, secret);
        if (!user) return errorResponse('Invalid token', 401);

        // 2. Check Balance
        const userData = await env.DB.prepare('SELECT wallet_balance, stripe_account_id FROM users WHERE id = ?').bind(user.id).first();

        if (!userData.stripe_account_id) return errorResponse('Stripe account not connected', 400);
        if (userData.wallet_balance < 10) return errorResponse('Minimum withdrawal is $10', 400);

        // 3. Process Withdrawal (Mocked)
        // In real app: Stripe Transfer
        const amount = userData.wallet_balance;
        const now = Math.floor(Date.now() / 1000);

        await env.DB.batch([
            // Deduct Balance
            env.DB.prepare('UPDATE users SET wallet_balance = 0 WHERE id = ?').bind(user.id),

            // Add Ledger Entry
            env.DB.prepare(`
                INSERT INTO ledger (id, user_id, type, amount, description, created_at)
                VALUES (?, ?, 'withdrawal', ?, 'Payout to Stripe', ?)
            `).bind(crypto.randomUUID(), user.id, -amount, now)
        ]);

        return jsonResponse({ success: true, amount, status: 'processing' });

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
