export class EditorSession {
    constructor(state, env) {
        this.state = state;
        this.env = env;
        this.sessions = new Set();
        this.lastSave = 0;
    }

    async fetch(request) {
        // Handle WebSocket Upgrade
        if (request.headers.get('Upgrade') === 'websocket') {
            const pair = new WebSocketPair();
            const [client, server] = Object.values(pair);

            await this.handleSession(server);

            return new Response(null, { status: 101, webSocket: client });
        }

        return new Response('Expected WebSocket', { status: 400 });
    }

    async handleSession(ws) {
        ws.accept();
        this.sessions.add(ws);

        // Load existing state
        const stored = await this.state.storage.get('editor_state');
        if (stored) {
            ws.send(JSON.stringify({ type: 'init', data: stored }));
        }

        ws.addEventListener('message', async (event) => {
            try {
                const msg = JSON.parse(event.data);

                if (msg.type === 'update') {
                    // Broadcast to others
                    this.broadcast(msg, ws);

                    // Autosave to DO storage
                    await this.state.storage.put('editor_state', msg.data);
                    this.lastSave = Date.now();
                }
            } catch (err) {
                console.error('DO Error:', err);
            }
        });

        ws.addEventListener('close', () => {
            this.sessions.delete(ws);
        });
    }

    broadcast(msg, excludeWs) {
        for (const session of this.sessions) {
            if (session !== excludeWs && session.readyState === WebSocket.READY_STATE_OPEN) {
                session.send(JSON.stringify(msg));
            }
        }
    }
}

export default {
    async fetch(request, env) {
        return await handleErrors(request, async () => {
            // Route to Durable Object
            const url = new URL(request.url);
            const id = env.EDITOR_DO.idFromName(url.pathname); // Use pathname as ID for simplicity
            const stub = env.EDITOR_DO.get(id);
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
