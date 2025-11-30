import { errorResponse } from '../../utils';

export const onRequestGet = async ({ request, env, params }) => {
    try {
        const { postId } = params;
        const upgradeHeader = request.headers.get('Upgrade');

        if (!upgradeHeader || upgradeHeader !== 'websocket') {
            return new Response('Expected Upgrade: websocket', { status: 426 });
        }

        // Get Durable Object ID
        const idObj = env.COMMENT_DO.idFromName(postId);
        const stub = env.COMMENT_DO.get(idObj);

        // Forward to DO
        return stub.fetch(request);

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
