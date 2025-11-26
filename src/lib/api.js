// Mock Data
const AUTHORS = [
    {
        id: '1',
        name: 'Hassan',
        avatar: 'https://ui-avatars.com/api/?name=Hassan&background=6366f1&color=fff',
        bio: 'Tech enthusiast and writer.',
    },
    {
        id: '2',
        name: 'Sarah',
        avatar: 'https://ui-avatars.com/api/?name=Sarah&background=ec4899&color=fff',
        bio: 'Design engineer.',
    },
];

const POSTS = [
    {
        id: '1',
        slug: 'future-of-edge-computing',
        title: 'The Future of Edge Computing',
        excerpt: 'Why Cloudflare Workers and edge-native architectures are changing the game for web performance.',
        coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
        authorId: '1',
        publishedAt: '2025-11-20T10:00:00Z',
        readTime: '5 min',
        tags: ['Edge', 'Cloudflare', 'Tech'],
        claps: 120,
        comments: 15,
    },
    {
        id: '2',
        slug: 'designing-for-readability',
        title: 'Designing for Readability',
        excerpt: 'Typography, spacing, and contrast: the pillars of a great reading experience.',
        coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
        authorId: '2',
        publishedAt: '2025-11-22T14:30:00Z',
        readTime: '3 min',
        tags: ['Design', 'UX', 'Typography'],
        claps: 85,
        comments: 8,
    },
    {
        id: '3',
        slug: 'minimalism-in-code',
        title: 'Minimalism in Code',
        excerpt: 'How to write cleaner, more maintainable code by doing less.',
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
        authorId: '1',
        publishedAt: '2025-11-25T09:15:00Z',
        readTime: '7 min',
        tags: ['Coding', 'Minimalism'],
        claps: 200,
        comments: 42,
    },
];

// API Methods
export const api = {
    getPosts: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const postsWithAuthors = POSTS.map(post => ({
                    ...post,
                    author: AUTHORS.find(a => a.id === post.authorId)
                }));
                resolve(postsWithAuthors);
            }, 500);
        });
    },

    getPostBySlug: async (slug) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const post = POSTS.find(p => p.slug === slug);
                if (post) {
                    resolve({
                        ...post,
                        author: AUTHORS.find(a => a.id === post.authorId)
                    });
                } else {
                    reject(new Error('Post not found'));
                }
            }, 300);
        });
    },

    getAuthor: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(AUTHORS.find(a => a.id === id)), 300);
        });
    },

    // Admin / Editor Methods
    getStats: async () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve([
                { label: 'Total Views', value: '45.2K', change: '+12%', icon: 'Eye' },
                { label: 'Active Users', value: '1,205', change: '+5%', icon: 'Users' },
                { label: 'Published Posts', value: '84', change: '+2', icon: 'FileText' },
                { label: 'Revenue', value: '$2,450', change: '+18%', icon: 'DollarSign' },
            ]), 500);
        });
    },

    getAdminPosts: async () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve([
                { id: 1, title: 'The Future of Edge Computing', author: 'Hassan', status: 'Published', date: '2025-11-20', views: 1205 },
                { id: 2, title: 'Designing for Readability', author: 'Sarah', status: 'Published', date: '2025-11-22', views: 850 },
                { id: 3, title: 'Minimalism in Code', author: 'Hassan', status: 'Draft', date: '2025-11-25', views: 0 },
                { id: 4, title: 'Understanding Cloudflare Workers', author: 'Hassan', status: 'Published', date: '2025-11-18', views: 2300 },
                { id: 5, title: 'React Performance Tips', author: 'Sarah', status: 'Draft', date: '2025-11-26', views: 0 },
            ]), 500);
        });
    },

    getUsers: async () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve([
                { id: 1, name: 'Hassan', email: 'hassan@example.com', role: 'Admin', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Hassan&background=6366f1&color=fff' },
                { id: 2, name: 'Sarah', email: 'sarah@example.com', role: 'Author', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Sarah&background=ec4899&color=fff' },
                { id: 3, name: 'John Doe', email: 'john@example.com', role: 'Reader', status: 'Active', avatar: null },
                { id: 4, name: 'Jane Smith', email: 'jane@example.com', role: 'Reader', status: 'Inactive', avatar: null },
            ]), 500);
        });
    },

    savePost: async () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ success: true }), 1000);
        });
    },

    // Campaigns
    getCampaigns: async () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve([
                { id: 1, name: 'Summer Sale', type: 'Direct', status: 'Active', impressions: '12.5K', clicks: 450, budget: '$500' },
                { id: 2, name: 'Tech Conference', type: 'Affiliate', status: 'Paused', impressions: '5.2K', clicks: 120, budget: '$200' },
                { id: 3, name: 'Cloud Hosting', type: 'Programmatic', status: 'Active', impressions: '45K', clicks: 890, budget: 'Unlimited' },
            ]), 500);
        });
    },

    createCampaign: async () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ success: true, id: Math.random().toString() }), 800);
        });
    },

    // Payouts
    getPayouts: async () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve([
                { id: 1, date: 'Nov 01, 2025', amount: '$1,250.00', status: 'Paid', method: 'Stripe' },
                { id: 2, date: 'Oct 01, 2025', amount: '$980.50', status: 'Paid', method: 'Stripe' },
                { id: 3, date: 'Sep 01, 2025', amount: '$1,100.00', status: 'Paid', method: 'Stripe' },
            ]), 500);
        });
    },

    getPayoutStats: async () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve({
                pendingBalance: '$450.00',
                nextPayoutDate: 'Dec 01, 2025'
            }), 300);
        });
    },

    // Auth
    login: async () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ success: true, message: 'Magic link sent' }), 1500);
        });
    },

    redeemInvite: async (token) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (token === 'valid-token') {
                    resolve({ success: true, user: { id: '1', name: 'New User' } });
                } else {
                    reject(new Error('Invalid token'));
                }
            }, 1500);
        });
    }
};
