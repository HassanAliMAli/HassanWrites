export const onRequest = async (context) => {
    const { request, next, env } = context;
    const url = new URL(request.url);

    // 1. Security Headers
    const response = await next();

    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.r2.cloudflarestorage.com; connect-src 'self' wss: https://api.stripe.com; frame-src https://js.stripe.com");

    // 2. Rate Limiting (Simple IP-based counter using KV)
    // Only rate limit API requests
    if (url.pathname.startsWith('/api/')) {
        const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
        const key = `rate_limit:${clientIP}`;

        // Get current count
        let count = await env.CONFIG_KV.get(key);
        count = count ? parseInt(count) : 0;

        if (count > 100) { // 100 requests per minute
            return new Response('Too Many Requests', { status: 429 });
        }

        // Increment count (expiration 60s)
        await env.CONFIG_KV.put(key, count + 1, { expirationTtl: 60 });
    }

    return response;
};
