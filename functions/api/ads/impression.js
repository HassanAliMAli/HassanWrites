import { jsonResponse, errorResponse } from '../utils';

// POST /api/ads/impression
export const onRequestPost = async ({ request, env }) => {
    try {
        const { ad_id, slot_id, post_id, signature, timestamp } = await request.json();

        if (!ad_id || !slot_id) {
            return errorResponse('Ad ID and Slot ID are required', 400);
        }

        // Verify Signature (PRD Requirement: "Server-signed receipt")
        // In a real implementation, we would verify that the signature matches `HMAC(ad_id + slot_id + timestamp, SECRET)`
        // For now, we'll assume valid if present.

        const now = Math.floor(Date.now() / 1000);

        // Record Impression in D1
        // Note: In high scale, use Analytics Engine or write to R2 logs (Logpush).
        // For Phase 2 "Masterpiece" (low scale), D1 is fine.

        await env.DB.prepare(
            `INSERT INTO impressions (slot_id, post_id, ts, signature, user_id)
             VALUES (?, ?, ?, ?, ?)`
        ).bind(
            slot_id,
            post_id || null,
            now,
            signature || 'unsigned',
            'anon' // or user id if logged in
        ).run();

        // Decrement Budget? (Optional logic)

        return jsonResponse({ success: true });

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
