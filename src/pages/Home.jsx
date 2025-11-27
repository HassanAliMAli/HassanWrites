import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { PostCard } from '@/components/blog/PostCard';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { SEO } from '@/components/seo/SEO';
import './Home.css';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await api.getPosts();
                setPosts(data);
            } catch {
                // Error handled silently
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="home-page">
            <SEO
                title="Home"
                description="Discover the future of writing. A curated collection of thoughts, stories, and ideas from the edge."
            />
            <section className="hero-section">
                <div className="container">
                    <h1 className="hero-title">
                        Discover the <span className="text-gradient">future</span> of writing.
                    </h1>
                    <p className="hero-subtitle">
                        A curated collection of thoughts, stories, and ideas from the edge.
                    </p>
                </div>
            </section>

            <section className="feed-section container">
                <div className="feed-header">
                    <h2 className="feed-title">Latest Stories</h2>
                    <div className="feed-filters">
                        <Button variant="ghost" size="sm" className="active">All</Button>
                        <Button variant="ghost" size="sm">Tech</Button>
                        <Button variant="ghost" size="sm">Design</Button>
                        <Button variant="ghost" size="sm">Culture</Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="feed-grid">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex flex-col gap-4">
                                <Skeleton className="h-48 w-full rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="feed-grid animate-slide-up delay-200">
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
