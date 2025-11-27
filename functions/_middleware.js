import { jsonResponse } from './api/utils';

export const onRequest = async (context) => {
    const { request, next } = context;

    // Handle CORS Preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    }

    try {
        return await next();
    } catch (err) {
        return jsonResponse({ error: 'Internal Server Error', details: err.message }, 500);
    }
};
