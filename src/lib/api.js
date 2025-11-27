

export const api = {
    // Posts
    getPosts: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`/api/posts?${query}`);
        if (!res.ok) throw new Error('Failed to fetch posts');
        return res.json();
    },

    getPostBySlug: async (slug) => {
        const res = await fetch(`/api/posts/${slug}`);
        if (!res.ok) throw new Error('Post not found');
        return res.json();
    },

    // Auth
    login: async (email) => {
        const res = await fetch('/auth/magic-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Login failed');
        }
        return res.json();
    },

    redeemInvite: async (token, name, email) => {
        const res = await fetch('/auth/invite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, name, email })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Invite redemption failed');
        }
        return res.json();
    },

    // Editor / Admin
    savePost: async (postData) => {
        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to save post');
        }
        return res.json();
    },

    publishPost: async () => {
        return { success: true };
    },

    // Media
    getUploadUrl: async (filename, contentType) => {
        const res = await fetch('/api/media/presigned-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename, contentType })
        });
        if (!res.ok) throw new Error('Failed to get upload URL');
        return res.json();
    },

    // Search
    search: async (query) => {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) return [];
        return res.json();
    },

    // Ads (Admin)
    createCampaign: async () => {
        return { success: true, id: 'mock-campaign-id' };
    }
};
