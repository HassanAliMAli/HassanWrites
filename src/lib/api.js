

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

    updatePost: async (slug, postData) => {
        const res = await fetch(`/api/posts/${slug}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to update post');
        }
        return res.json();
    },

    publishPost: async (slug, postData) => {
        // If slug exists, it's an update. If not, it's a create (savePost handles create)
        if (slug) {
            return api.updatePost(slug, { ...postData, status: 'published' });
        } else {
            return api.savePost({ ...postData, status: 'published' });
        }
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

    getCurrentUser: async () => {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) return null;
        return res.json();
    },

    logout: async () => {
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        return res.json();
    },

    getUsers: async () => {
        const res = await fetch('/api/users', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
    },

    createUser: async (userData) => {
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(userData)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to create user');
        }
        return res.json();
    },

    deleteUser: async (userId) => {
        const res = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to delete user');
        return res.json();
    },

    getSubscribers: async () => {
        // In a real implementation, this would hit a dedicated /api/subscribers endpoint
        // For now, we reuse the users endpoint as it contains subscriber info
        const res = await fetch('/api/users', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch subscribers');
        return res.json();
    }
};
