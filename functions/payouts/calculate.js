export const onRequest = async ({ request, env }) => {
    // Scheduled Worker (Cron Trigger) or Secured Endpoint
    // In wrangler.toml: [triggers] crons = ["0 0 * * *"] (Midnight daily)

    try {
        // 0. Security Check
        const authHeader = request.headers.get('Authorization');
        const cronSecret = env.CRON_SECRET || 'dev-cron-secret'; // Set this in Cloudflare Dashboard

        if (authHeader !== `Bearer ${cronSecret}`) {
            return new Response('Unauthorized', { status: 401 });
        }

        const now = Math.floor(Date.now() / 1000);
        // Align to previous day midnight for consistency
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const periodEnd = Math.floor(todayMidnight.getTime() / 1000);
        const periodStart = periodEnd - 86400;

        // 1. Aggregate Views per Author for Yesterday
        const query = `
            SELECT p.author_id, COUNT(*) as view_count
            FROM analytics_events e
            JOIN posts p ON e.post_id = p.id
            WHERE e.type = 'pageview'
            AND e.created_at >= ? AND e.created_at < ?
            GROUP BY p.author_id
        `;

        const stats = await env.DB.prepare(query).bind(periodStart, periodEnd).all();

        // 2. Calculate Earnings (RPM Model: $1.00 per 1000 views)
        const RPM = 1.00;
        let processed = 0;

        for (const stat of stats.results) {
            // Idempotency Check: Did we already pay this user for this period?
            const existing = await env.DB.prepare(
                'SELECT id FROM payouts WHERE user_id = ? AND period_start = ?'
            ).bind(stat.author_id, periodStart).first();

            if (existing) {
                continue;
            }

            const earnings = (stat.view_count / 1000) * RPM;

            if (earnings > 0) {
                const payoutId = crypto.randomUUID();

                // Transaction: Add to Payouts, Ledger, and User Balance
                await env.DB.batch([
                    // Create Payout Record (Pending)
                    env.DB.prepare(`
                        INSERT INTO payouts (id, user_id, amount, status, period_start, period_end, created_at)
                        VALUES (?, ?, ?, 'pending', ?, ?, ?)
                    `).bind(payoutId, stat.author_id, earnings, periodStart, periodEnd, now),

                    // Add to Ledger
                    env.DB.prepare(`
                        INSERT INTO ledger (id, user_id, type, amount, description, reference_id, created_at)
                        VALUES (?, ?, 'earning', ?, 'Daily Ad Revenue', ?, ?)
                    `).bind(crypto.randomUUID(), stat.author_id, earnings, payoutId, now),

                    // Update User Balance
                    env.DB.prepare(`
                        UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?
                    `).bind(earnings, stat.author_id)
                ]);
                processed++;
            }
        }

        return new Response(`Payouts Calculated: ${processed} processed`, { status: 200 });

    } catch (err) {
        console.error('Payout Calculation Error:', err);
        return new Response(err.message, { status: 500 });
    }
};
