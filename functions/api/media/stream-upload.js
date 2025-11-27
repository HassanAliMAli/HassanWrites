import { jsonResponse, errorResponse, verifyToken } from '../utils';

// POST /api/media/stream-upload
export const onRequestPost = async ({ request, env }) => {
    try {
        // 1. Auth Check
        const cookie = request.headers.get('Cookie');
        const token = cookie?.split('session=')[1]?.split(';')[0];
        if (!token) return errorResponse('Unauthorized', 401);

        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const user = await verifyToken(token, secret);
        if (!user) return errorResponse('Invalid token', 401);

        // 2. Call Cloudflare Stream API
        // Docs: https://developers.cloudflare.com/stream/uploading-videos/direct-creator-uploads/

        if (!env.CLOUDFLARE_ACCOUNT_ID || !env.CLOUDFLARE_API_TOKEN) {
            return errorResponse('Server misconfiguration: Missing Cloudflare keys', 500);
        }

        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/stream/direct_upload`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    maxDurationSeconds: 3600,
                    creator: user.id,
                    allowedOrigins: ['*'], // Restrict in prod
                    requireSignedURLs: false, // Set true if using signed URLs for playback
                    meta: {
                        uploadedBy: user.email
                    }
                }),
            }
        );

        const data = await response.json();

        if (!data.success) {
            return errorResponse(`Stream API Error: ${data.errors[0]?.message}`, 500);
        }

        return jsonResponse({
            success: true,
            uploadUrl: data.result.uploadURL,
            uid: data.result.uid
        });

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
