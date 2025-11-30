export class EditorSession {
    constructor(state, env) {
        this.state = state;
        this.env = env;
        this.sessions = new Set();
        this.lastSave = null;
        this.content = null;
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

        // Send current content on connect
        if (this.content) {
            webSocket.send(JSON.stringify({ type: 'init', content: this.content }));
        } else {
            // Try to load from storage
            const stored = await this.state.storage.get('content');
            if (stored) {
                this.content = stored;
                webSocket.send(JSON.stringify({ type: 'init', content: stored }));
            }
        }

        webSocket.addEventListener('message', async (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'update') {
                    this.content = data.content;
                    this.lastSave = Date.now();

                    // Broadcast to others
                    this.broadcast(JSON.stringify({ type: 'update', content: this.content }), webSocket);

                    // Save to storage (debounced in real app, but here direct)
                    await this.state.storage.put('content', this.content);
                    await this.state.storage.put('lastSave', this.lastSave);
                }
            } catch (err) {
                console.error('WebSocket message error:', err);
            }
        });

        webSocket.addEventListener('close', () => {
            this.sessions.delete(webSocket);
        });
    }

    broadcast(message, sender) {
        for (const session of this.sessions) {
            if (session !== sender) {
                try {
                    session.send(message);
                } catch {
                    this.sessions.delete(session);
                }
            }
        }
    }
}
