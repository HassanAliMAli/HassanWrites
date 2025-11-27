// Real API Client for Cloudflare Backend

// Helper to transform DB Post -> UI Post
const transformPost = (post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.cover_image || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', // Fallback/Placeholder
    author: {
        id: post.author_id,
        name: post.author_name,
        avatar: post.author_avatar ? `/cdn-cgi/image/width=100/${post.author_avatar}` : null
    },
    publishedAt: post.published_at ? new Date(post.published_at * 1000).toISOString() : new Date().toISOString(),
    readTime: '5 min', // Placeholder or calc from word count
    tags: typeof post.tags === 'string' ? JSON.parse(post.tags) : (post.tags || []),
    claps: 0, // Not implemented yet
    comments: 0 // Not implemented yet
});

export const api = {
    // Posts
    getPosts: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`/api/posts?${query}`);
        if (!res.ok) throw new Error('Failed to fetch posts');
        const posts = await res.json();
        return posts.map(transformPost);
    },

    getPostBySlug: async (slug) => {
        const res = await fetch(`/api/posts/${slug}`);
        if (!res.ok) throw new Error('Post not found');
        const post = await res.json();
        return transformPost(post);
    },

    // Auth
    login: async (email) => {
        const res = await fetch('/auth/magic-link', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
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
            throw new Error(err.error || 'Invite failed');
        }
        return res.json();
    },

    // Editor / Admin
    savePost: async (postData) => {
        const method = postData.id ? 'PUT' : 'POST';
        const url = postData.id ? `/api/posts/${postData.id}` : '/api/posts';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        });
        if (!res.ok) throw new Error('Failed to save post');
        return res.json();
    },

    publishPost: async (id, html) => {
        const res = await fetch(`/api/posts/${id}/publish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ html })
        });
        if (!res.ok) throw new Error('Failed to publish');
        return res.json();
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
    createCampaign: async (campaignData) => {
        const res = await fetch('/api/ads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(campaignData)
        });
        if (!res.ok) throw new Error('Failed to create campaign');
        return res.json();
    }
};
