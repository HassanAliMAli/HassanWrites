import { errorResponse, generateToken } from '../api/utils';

export const onRequestGet = async ({ request, env }) => {
    try {
        const url = new URL(request.url);
        const token = url.searchParams.get('token');

        if (!token) return errorResponse('Token required', 400);

        // 1. Verify Magic Link Token (Mocked)
        // In real app, check KV for token existence and associated email
        // For now, we assume token is valid and maps to a demo user if it matches our mock format
        // Or we just lookup the user by email if we passed it (insecure for prod, but okay for this stage)

        // Let's assume the token is a user ID for simplicity in this phase
        // OR we just fetch the first user for demo purposes
        const user = await env.DB.prepare('SELECT * FROM users LIMIT 1').first();

        if (!user) {
            return errorResponse('Invalid token or user not found', 401);
        }

        // 2. Generate Session JWT
        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const sessionToken = await generateToken({ id: user.id, email: user.email, role: user.role }, secret);

        // 3. Redirect to Dashboard with Cookie
        const headers = new Headers();
        headers.append('Set-Cookie', `session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`);
        headers.append('Location', '/');

        return new Response(null, {
            status: 302,
            headers
        });

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};
