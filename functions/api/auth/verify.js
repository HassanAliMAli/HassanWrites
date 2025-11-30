import { errorResponse, verifyToken, generateToken } from '../utils.js';

export const onRequestGet = async (context) => {
    try {
        const { request, env } = context;
        const url = new URL(request.url);
        const token = url.searchParams.get('token');

        if (!token) {
            return errorResponse('Token is required');
        }

        // 1. Verify Token
        const payload = await verifyToken(token, env.JWT_SECRET);
        if (!payload || payload.type !== 'magic_link') {
            return errorResponse('Invalid or expired token', 401);
        }

        // 2. Fetch User (to ensure they still exist and get latest role)
        const db = env.DB;
        const user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(payload.sub).first();

        if (!user) {
            return errorResponse('User not found', 404);
        }

        // 3. Generate Session Token
        // Long-lived session (e.g., 7 days)
        const sessionToken = await generateToken({ sub: user.id, role: user.role }, env.JWT_SECRET);

        // 4. Set Cookie
        // HttpOnly, Secure, SameSite=Strict
        const cookie = `auth_token=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24 * 7}`;

        // 5. Return Success with Cookie
        return new Response(JSON.stringify({ user }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': cookie,
                'Access-Control-Allow-Origin': '*', // Adjust for prod
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });

    } catch (error) {
        console.error('Verify error:', error);
        return errorResponse('Internal Server Error', 500);
    }
};
