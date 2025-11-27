import { jsonResponse } from './utils';

export const onRequestPost = async ({ request, env }) => {
    try {
        const { level, message, meta } = await request.json();

        const logId = crypto.randomUUID();
        const timestamp = new Date().toISOString();

        const logEntry = {
            id: logId,
            timestamp,
            level: level || 'info',
            message,
            meta
        };

        // Store in KV
        await env.CONFIG_KV.put(`log:${timestamp}:${logId}`, JSON.stringify(logEntry), { expirationTtl: 604800 });

        return jsonResponse({ success: true, id: logId });

    } catch (err) {
        console.error('Logging Error:', err);
        return jsonResponse({ success: false }, 500);
    }
};
