export class DashboardStats {
    constructor(state, env) {
        this.state = state;
        this.env = env;
    }

    async fetch(request) {
        const url = new URL(request.url);

        if (request.method === 'POST' && url.pathname === '/record') {
            const { type, value } = await request.json();

            // Update stats
            let current = await this.state.storage.get(type) || 0;
            current += value;
            await this.state.storage.put(type, current);

            return new Response('OK');
        }

        if (request.method === 'GET' && url.pathname === '/stats') {
            const stats = await this.state.storage.list();
            return new Response(JSON.stringify(Object.fromEntries(stats)));
        }

        return new Response('Not found', { status: 404 });
    }
}
