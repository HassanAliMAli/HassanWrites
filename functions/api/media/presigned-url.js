import { jsonResponse, errorResponse, verifyToken } from '../utils';
import { AwsClient } from 'aws4fetch';

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
        if (!filename || !contentType) return errorResponse('Filename and Content-Type required', 400);

        // 2. Generate Key
        const key = `uploads/${user.id}/${crypto.randomUUID()}-${filename}`;

        // 3. Generate Presigned URL using aws4fetch (R2 compatible)
        const r2 = new AwsClient({
            accessKeyId: env.R2_ACCESS_KEY_ID,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY,
            service: 's3',
            region: 'auto',
        });

        const url = new URL(`https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.MEDIA_BUCKET_NAME}/${key}`);
        url.searchParams.set('X-Amz-Expires', '3600');

        const signed = await r2.sign(url, {
            method: 'PUT',
            headers: { 'Content-Type': contentType },
            aws: { signQuery: true }
        });

        return jsonResponse({
            uploadUrl: signed.url,
            key: key
        });

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
