import { jsonResponse, errorResponse, verifyToken } from '../utils.js';


export const onRequestGet = async ({ request, env, params }) => {
    try {
        const { slug } = params;

        const query = `
            SELECT p.*, u.name as author_name, u.avatar_r2_key as author_avatar, u.bio as author_bio
            FROM posts p 
            JOIN users u ON p.author_id = u.id
            WHERE p.slug = ?
        `;
        const post = await env.DB.prepare(query).bind(slug).first();

        if (!post) return errorResponse('Post not found', 404);

        // Check if post is paywalled
        const isPaywalled = post.paywall === 1;

        // Get content from R2 if published
        let content = null;
        let canAccess = true;

        if (post.status === 'published' && post.canonical_r2_key) {
            // If post is paywalled, check access
            if (isPaywalled) {
                // Check if request is from an author (check for author JWT)
                const authCookie = request.headers.get('cookie')?.split(';')
                    .find(c => c.trim().startsWith('auth_token='));

                let user = null;
                if (authCookie) {
                    const token = authCookie.split('=')[1];
                    user = await verifyToken(token, env.JWT_SECRET);
                }

                // If author/admin is logged in, they have full access
                // Or if user has subscription
                if (user && (user.role === 'admin' || user.role === 'author' || user.sub === post.author_id)) {
                    canAccess = true;
                } else {
                    // Check subscriber session
                    // For now, let's assume validateSubscriberSession handles the logic
                    // But since we are in Phase 2, we might not have full subscription logic yet.
                    // Let's use a placeholder or basic check.
                    // If we have a user and they have a subscription in DB?
                    if (user) {
                        const sub = await env.DB.prepare('SELECT status FROM subscriptions WHERE user_id = ?').bind(user.sub).first();
                        if (sub && sub.status === 'active') {
                            canAccess = true;
                        } else {
                            canAccess = false;
                        }
                    } else {
                        canAccess = false;
                    }
                }
            }

            // Fetch content if user has access
            if (canAccess) {
                const object = await env.MEDIA_BUCKET.get(post.canonical_r2_key);
                if (object) {
                    content = await object.text();
                }
            }
        }

        // Return post data
        const responseData = {
            ...post,
            content: canAccess ? content : null,
            paywall: isPaywalled,
            has_access: canAccess,
            tags: post.tags ? JSON.parse(post.tags) : []
        };

        // If paywalled and no access, only return excerpt
        if (isPaywalled && !canAccess && content) {
            // Extract first 200 characters as excerpt
            const textContent = content.replace(/<[^>]*>/g, '').substring(0, 200);
            responseData.excerpt = textContent + '...';
        }

        return jsonResponse(responseData, 200, {
            'Cache-Control': isPaywalled ? 'private, no-cache' : 'public, max-age=300, stale-while-revalidate=3600'
        });

    } catch (err) {
        console.error('Error fetching post:', err);
        return errorResponse(err.message, 500);
    }
};

export const onRequestPut = async ({ request, env, params }) => {
    try {
        const { slug } = params;
        const cookie = request.headers.get('Cookie');
        const token = cookie?.split('auth_token=')[1]?.split(';')[0];
        if (!token) return errorResponse('Unauthorized', 401);

        const secret = env.JWT_SECRET || 'dev-secret-fallback';
        const user = await verifyToken(token, secret);
        if (!user) return errorResponse('Invalid token', 401);

        const { title, excerpt, tags, paywall, status } = await request.json();
        const now = Math.floor(Date.now() / 1000);

        // Build update query dynamically
        let query = 'UPDATE posts SET updated_at = ?';
        const queryParams = [now];

        if (title !== undefined) {
            query += ', title = ?';
            queryParams.push(title);
        }
        if (excerpt !== undefined) {
            query += ', excerpt = ?';
            queryParams.push(excerpt);
        }
        if (tags !== undefined) {
            query += ', tags = ?';
            queryParams.push(JSON.stringify(tags));
        }
        if (paywall !== undefined) {
            query += ', paywall = ?';
            queryParams.push(paywall ? 1 : 0);
        }
        if (status !== undefined) {
            query += ', status = ?';
            queryParams.push(status);
        }

        query += ' WHERE slug = ? AND author_id = ?';
        queryParams.push(slug, user.sub); // verifyToken returns sub

        const result = await env.DB.prepare(query).bind(...queryParams).run();

        if (result.meta.changes === 0) {
            return errorResponse('Post not found or unauthorized', 404);
        }

        return jsonResponse({ success: true, slug });

    } catch (err) {
        console.error('Error updating post:', err);
        return errorResponse(err.message, 500);
    }
};
