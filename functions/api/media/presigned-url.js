import { AwsClient } from 'aws4fetch';
import { jsonResponse, errorResponse, verifyToken } from '../utils';

// POST /api/media/presigned-url
export const onRequestPost = async ({ request, env }) => {
    try {
        // 1. Auth Check
        const cookie = request.headers.get('Cookie');
        const token = cookie?.split('session=')[1]?.split(';')[0];
        if (!token) return errorResponse('Unauthorized', 401);

        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const user = await verifyToken(token, secret);
        if (!user) return errorResponse('Invalid token', 401);

        const { filename, contentType } = await request.json();

        if (!filename || !contentType) {
            return errorResponse('Filename and Content-Type are required', 400);
        }

        // 2. Generate Unique Key
        // Structure: uploads/{userId}/{timestamp}-{random}-{filename}
        const key = `uploads/${user.id}/${Date.now()}-${crypto.randomUUID().split('-')[0]}-${filename}`;

        // 3. Generate Signed URL using aws4fetch
        // R2 is S3-compatible. We need R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY in env vars.
        // NOTE: In Cloudflare Pages, bindings (env.MEDIA_BUCKET) don't expose keys directly for signing.
        // We need explicit env vars: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ACCOUNT_ID.

        if (!env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY || !env.R2_ACCOUNT_ID) {
            return errorResponse('Server misconfiguration: Missing R2 keys', 500);
        }

        const r2 = new AwsClient({
            accessKeyId: env.R2_ACCESS_KEY_ID,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY,
            service: 's3',
            region: 'auto',
        });

        const url = new URL(
            `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.MEDIA_BUCKET_NAME || 'edgemaster-media'}/${key}`
        );

        // Sign the request
        // We want a PUT request
        const signed = await r2.sign(url.toString(), {
            method: 'PUT',
            headers: {
                'Content-Type': contentType,
            },
            aws: { signQuery: true }, // Generate a signed URL with query params
        });

        return jsonResponse({
            success: true,
            uploadUrl: signed.url,
            key: key,
            publicUrl: `${env.PUBLIC_R2_DOMAIN || 'https://pub-domain.com'}/${key}` // Domain for viewing
        });

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
