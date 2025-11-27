export class EditorSession {
    constructor(state, env) {
        this.state = state;
        this.env = env;
        this.storage = state.storage;
        this.sessions = new Set();
        this.lastSave = 0;
    }

    async fetch(request) {
        const url = new URL(request.url);

        // WebSocket Upgrade
        if (request.headers.get('Upgrade') === 'websocket') {
            const pair = new WebSocketPair();
            const [client, server] = Object.values(pair);

            await this.handleSession(server);

            return new Response(null, { status: 101, webSocket: client });
        }

        // HTTP Fallback (Get current state)
        if (request.method === 'GET') {
            const data = await this.storage.get('draft') || {};
            return new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // HTTP Save (POST)
        if (request.method === 'POST') {
            const body = await request.json();
            // Update state
            await this.storage.put('draft', body);

            // Broadcast update to WS clients
            this.broadcast(JSON.stringify({ type: 'update', data: body }));

            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response('Not found', { status: 404 });
    }

    async handleSession(webSocket) {
        webSocket.accept();
        this.sessions.add(webSocket);

        // Send current state on connect
        const data = await this.storage.get('draft');
        if (data) {
            webSocket.send(JSON.stringify({ type: 'init', data }));
        }

        webSocket.addEventListener('message', async (event) => {
            try {
                const msg = JSON.parse(event.data);

                if (msg.type === 'update') {
                    // Broadcast to others
                    this.broadcast(JSON.stringify({ type: 'update', data: msg.data }), webSocket);

                    // Save to storage (Debounced in logic, or just save here for now)
                    // In a real app, you'd debounce this or use `this.storage.put` which is fast.
                    await this.storage.put('draft', msg.data);

                    // Optional: Persist to D1 every X seconds or on specific events
                    // For now, we trust DO storage as the "hot" source of truth.
                }
            } catch (err) {
                console.error('DO Error:', err);
            }
        });

        webSocket.addEventListener('close', () => {
            this.sessions.delete(webSocket);
        });
    }

    broadcast(message, excludeWs) {
        for (const session of this.sessions) {
            if (session !== excludeWs && session.readyState === WebSocket.READY_STATE_OPEN) {
                session.send(message);
            }
        }
    }
}

export default {
    async fetch(request, env) {
        // Router for Worker
        const url = new URL(request.url);
        const path = url.pathname;

        if (path.startsWith('/session/')) {
            const id = path.split('/').pop();
            const idObj = env.EDITOR_SESSION.idFromName(id);
            const stub = env.EDITOR_SESSION.get(idObj);
            return stub.fetch(request);
        }

        return new Response('Backend Worker Active', { status: 200 });
    }
};
