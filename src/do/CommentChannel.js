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
