import { jsonResponse, errorResponse } from '../utils';

// GET /api/ads/decision?slot=...
export const onRequestGet = async ({ request, env }) => {
    try {
        // 1. Fetch Active Ads
        // Priority: Direct (1) > Affiliate (2) > Programmatic (3)
        // We select one ad from the highest priority group available.

        const ads = await env.DB.prepare(`
            SELECT * FROM ads 
            WHERE start_at <= ? AND (end_at IS NULL OR end_at >= ?)
            ORDER BY priority DESC, created_at DESC
            LIMIT 10
        `).bind(Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000)).all();

        if (!ads.results || ads.results.length === 0) {
            // Fallback to default/house ad or empty
            return jsonResponse({ ad: null });
        }

        // Simple logic: Pick the first one (highest priority)
        // In a real engine, we'd do weighted rotation, budget checking, etc.
        const selectedAd = ads.results[0];

        // 2. Log Impression (Async - Fire and Forget)
        // In a real app, use a queue or Analytics Engine.
        // Here we just return the ad and let the client fire the impression pixel.

        return jsonResponse({
            ad: {
                id: selectedAd.id,
                type: selectedAd.type,
                creativeUrl: selectedAd.creative_r2_key ? `${env.PUBLIC_R2_DOMAIN}/${selectedAd.creative_r2_key}` : null,
                link: JSON.parse(selectedAd.targeting_json || '{}').link || '#',
                trackingUrl: `/api/ads/impression?ad=${selectedAd.id}`
            }
        });

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
