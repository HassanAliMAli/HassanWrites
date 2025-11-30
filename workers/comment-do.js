export class CommentChannel {
    constructor(state, env) {
        this.state = state;
        this.env = env;
        this.sessions = new Set();
    }

    async fetch(request) {
        const url = new URL(request.url);

        if (url.pathname === '/websocket') {
            if (request.headers.get('Upgrade') !== 'websocket') {
                return new Response('Expected Upgrade: websocket', { status: 426 });
            }

            const { 0: client, 1: server } = new WebSocketPair();
            await this.handleSession(server);

            return new Response(null, { status: 101, webSocket: client });
        }

        return new Response('Not found', { status: 404 });
    }

    async handleSession(webSocket) {
        webSocket.accept();
        this.sessions.add(webSocket);

        webSocket.addEventListener('message', async (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'new_comment') {
                    // Broadcast new comment to all connected clients
                    this.broadcast(JSON.stringify({
                        type: 'new_comment',
                        comment: data.comment
                    }));
                }
            } catch (err) {
                console.error('WebSocket message error:', err);
            }
        });

        webSocket.addEventListener('close', () => {
            this.sessions.delete(webSocket);
        });
    }

    broadcast(message) {
        for (const session of this.sessions) {
            try {
                session.send(message);
            } catch {
                this.sessions.delete(session);
            }
        }
    }
}

export default {
    async fetch(request, env) {
        return await handleErrors(request, async () => {
            const url = new URL(request.url);
            // Use pathname as ID or a specific ID if needed. 
            // For comments, we likely want one DO per post.
            // The path might be /comments/POST_ID/stream
            // We need to extract the ID.
            // Assuming the request comes from the Worker/Pages Function which calls `idFromName(postId)`.
            // But here we are inside the Worker that *routes* to the DO.
            // Wait, the Pages Function calls `env.COMMENT_DO.get(id)`.
            // So the request arriving HERE is already targeted at a specific DO instance?
            // NO. `env.COMMENT_DO.get(id).fetch(request)` sends the request DIRECTLY to the DO instance's `fetch` method (the class method).
            // It does NOT go through the `export default` worker unless we are accessing it via HTTP from outside (which we are not, we are using internal binding).

            // HOWEVER, Cloudflare Workers usually require a default export for the worker script itself if it's deployed as a Worker.
            // If it's just a DO definition, it might be fine.
            // But `wrangler.toml` points to `script_name = "comment-do"`.
            // If `comment-do` is a separate worker, it needs a default export.
            // If it's just providing the class for Pages to bind to, it might still need to be a valid module.

            // Let's look at `editor-do.js` again.
            // It has `export default { fetch ... }`.
            // This suggests we should have it.

            // If the Pages Function uses `env.COMMENT_DO.get(...)`, it talks to the DO class directly.
            // The `export default` is only needed if we want to expose this Worker to the public internet or if the runtime requires it.
            // I will add it to be safe and consistent with `editor-do.js`.

            const id = env.COMMENT_DO.idFromName(url.pathname);
            const stub = env.COMMENT_DO.get(id);
            return await stub.fetch(request);
        });
    }
};

async function handleErrors(request, func) {
    try {
        return await func();
    } catch (err) {
        return new Response(err.message, { status: 500 });
    }
}
