import React from 'react';
import { Button } from '@/components/ui/Button';
import { PostTable } from '@/components/admin/PostTable';
import './Admin.css';

const Posts = () => {
    // Mock Data
    const posts = [
        { id: 1, title: 'The Future of Edge Computing', author: 'Hassan', status: 'Published', date: '2025-11-20', views: 1205 },
        { id: 2, title: 'Designing for Readability', author: 'Sarah', status: 'Published', date: '2025-11-22', views: 850 },
        { id: 3, title: 'Minimalism in Code', author: 'Hassan', status: 'Draft', date: '2025-11-25', views: 0 },
        { id: 4, title: 'Understanding Cloudflare Workers', author: 'Hassan', status: 'Published', date: '2025-11-18', views: 2300 },
        { id: 5, title: 'React Performance Tips', author: 'Sarah', status: 'Draft', date: '2025-11-26', views: 0 },
    ];

    return (
        <div className="admin-page">
            <div className="flex justify-between items-center">
                <h1 className="admin-title">Posts</h1>
                <Button>New Post</Button>
            </div>

            <PostTable posts={posts} />
        </div>
    );
};

export default Posts;
