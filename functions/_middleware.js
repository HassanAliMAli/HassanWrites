import { errorResponse } from './api/utils';

export const onRequest = async ({ request, env, next }) => {
    const clientIP = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
    const userAgent = request.headers.get('User-Agent') || '';

    const badBots = ['malicious-bot', 'scraper-bot'];
    if (badBots.some(bot => userAgent.includes(bot))) {
        return new Response('Forbidden', { status: 403 });
    }

    if (env.CONFIG_KV) {
        const key = `rate_limit:${clientIP}:${Math.floor(Date.now() / 60000)}`;
        let count = await env.CONFIG_KV.get(key);
        count = count ? parseInt(count) : 0;

        if (count > 100) {
            return errorResponse('Too Many Requests', 429);
        }

        env.CONFIG_KV.put(key, (count + 1).toString(), { expirationTtl: 60 }).catch(() => { });
    }

    const response = await next();

    const newHeaders = new Headers(response.headers);
    newHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    newHeaders.set('X-Content-Type-Options', 'nosniff');
    newHeaders.set('X-Frame-Options', 'DENY');
    newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    newHeaders.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' wss: https:;");

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
    });
};
