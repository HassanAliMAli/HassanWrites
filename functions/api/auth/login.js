import { jsonResponse, errorResponse, generateToken } from '../utils.js';
import { sendMagicLinkEmail } from '../utils/email.js';

export const onRequestPost = async (context) => {
    try {
        const { request, env } = context;
        const { email } = await request.json();

        if (!email) {
            return errorResponse('Email is required');
        }

        // 1. Check if user exists
        const db = env.DB;
        const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();

        if (!user) {
            // For invite-only, we might want to block unknown emails or handle invites here.
            // For now, let's return success to avoid leaking user existence, 
            // OR if we want to allow open signup (which PRD says NO), we would create.
            // PRD: "Invite-only multi-author platform".
            // So we should strictly check for invites or existing users.
            // But for the "Owner" setup, we might need a way to get in.
            // Let's assume if no user, we check for an invite token? 
            // Or maybe just return success but don't send email (security best practice).

            // However, for this phase, let's just say "User not found" or similar if we want to be explicit for the dev,
            // but for prod, generic message is better.
            // Let's go with generic success message.
            return jsonResponse({ message: 'If an account exists, a magic link has been sent.' });
        }

        // 2. Generate Magic Link Token
        // Payload: { sub: user.id, email: user.email, type: 'magic_link' }
        const token = await generateToken({ sub: user.id, email: user.email, type: 'magic_link' }, env.JWT_SECRET);

        // 3. Construct Link
        // Assuming frontend handles /auth/verify?token=...
        const magicLink = `${new URL(request.url).origin}/auth/verify?token=${token}`;

        // 4. Send Email
        const emailResult = await sendMagicLinkEmail(email, magicLink, env);

        if (!emailResult.success) {
            console.error('Failed to send magic link email:', emailResult.error);
            return errorResponse('Failed to send magic link', 500);
        }

        return jsonResponse({ message: 'If an account exists, a magic link has been sent.' });

    } catch (error) {
        console.error('Login error:', error);
        return errorResponse('Internal Server Error', 500);
    }
};
