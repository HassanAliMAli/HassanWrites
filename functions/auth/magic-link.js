import { jsonResponse, errorResponse, generateToken, verifyToken } from '../api/utils';

// POST /auth/magic-link -> Sends the link
export const onRequestPost = async ({ request, env }) => {
    try {
        const { email } = await request.json();

        if (!email) return errorResponse('Email is required', 400);

        // 1. Check if user exists
        const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();

        if (!user) {
            return jsonResponse({ success: true, message: 'If an account exists, a magic link has been sent.' });
        }

        // 2. Generate Magic Link Token
        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        // Short expiry for magic link (15 mins)
        // We use a simple payload here. In prod, maybe sign a specific "magic-link" type token.
        const magicToken = btoa(JSON.stringify({ email, exp: Date.now() + 900000 }));

        const magicLink = \`\${new URL(request.url).origin}/auth/magic-link?token=\${magicToken}\`;

        console.log(\`[DEV] Magic Link for \${email}: \${magicLink}\`);

        return jsonResponse({ 
            success: true, 
            message: 'Magic link sent (check console in dev)',
            dev_link: magicLink 
        });

    } catch (err) {
        return errorResponse(err.message, 500);
    }
};

// GET /auth/magic-link?token=... -> Verifies and logs in
export const onRequestGet = async ({ request, env }) => {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) return errorResponse('Missing token', 400);

    try {
        // Decode token
        const payload = JSON.parse(atob(token));
        
        if (Date.now() > payload.exp) {
            return errorResponse('Token expired', 401);
        }

        const email = payload.email;

        // Get User
        const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
        if (!user) return errorResponse('User not found', 404);

        // Generate Session
        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const sessionToken = await generateToken({ id: user.id, email: user.email, role: user.role }, secret);

        // Redirect to Dashboard
        const response = Response.redirect(\`\${url.origin}/admin\`, 302);
        response.headers.append('Set-Cookie', `session = ${ sessionToken }; HttpOnly; Secure; SameSite = Strict; Path =/; Max-Age=604800`);

        return response;

    } catch (err) {
        return errorResponse('Invalid token', 400);
    }
};
