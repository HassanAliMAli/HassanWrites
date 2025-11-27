export class DashboardStats {
    constructor(state, env) {
        this.state = state;
        this.env = env;
        this.activeVisitors = 0;
        this.sessions = new Set();
    }

    async fetch(request) {
        const url = new URL(request.url);

        if (url.pathname.endsWith('/ws')) {
            if (request.headers.get('Upgrade') === 'websocket') {
                const pair = new WebSocketPair();
                const [client, server] = Object.values(pair);
                await this.handleSession(server);
                return new Response(null, { status: 101, webSocket: client });
            }
            return new Response('Expected WebSocket', { status: 400 });
        }

        if (url.pathname.endsWith('/stats')) {
            return new Response(JSON.stringify({ activeVisitors: this.activeVisitors }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response('Not Found', { status: 404 });
    }

    async handleSession(ws) {
        ws.accept();
        this.sessions.add(ws);
        this.activeVisitors++;
        this.broadcast();

        ws.addEventListener('close', () => {
            this.sessions.delete(ws);
            this.activeVisitors--;
            this.broadcast();
        });
    }

    broadcast() {
        const msg = JSON.stringify({ type: 'stats', data: { activeVisitors: this.activeVisitors } });
        for (const session of this.sessions) {
            if (session.readyState === WebSocket.READY_STATE_OPEN) {
                session.send(msg);
            }
        }
    }
}

export default {
    async fetch(request, env) {
        return await handleErrors(request, async () => {
            // Singleton DO for global stats (or sharded by user ID)
            // For Phase 3, we'll use a single global instance for simplicity
            const id = env.DASHBOARD_DO.idFromName('global');
            const stub = env.DASHBOARD_DO.get(id);
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
