import { errorResponse, verifyToken } from '../../utils';

export const onRequestGet = async ({ request, env, params }) => {
    try {
        const { id } = params;
        const upgradeHeader = request.headers.get('Upgrade');

        if (!upgradeHeader || upgradeHeader !== 'websocket') {
            return new Response('Expected Upgrade: websocket', { status: 426 });
        }

        // Auth Check
        const cookie = request.headers.get('Cookie');
        const token = cookie?.split('auth_token=')[1]?.split(';')[0];
        if (!token) return errorResponse('Unauthorized', 401);

        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const user = await verifyToken(token, secret);
        if (!user) return errorResponse('Invalid token', 401);

        // Get Durable Object ID
        const idObj = env.EDITOR_DO.idFromName(id);
        const stub = env.EDITOR_DO.get(idObj);

        // Forward to DO
        return stub.fetch(request);

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
