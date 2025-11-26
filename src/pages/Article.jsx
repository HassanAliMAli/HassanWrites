import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { ArticleShell } from '@/components/layout/ArticleShell';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Comments from '@/components/blog/Comments';
import Paywall from '@/components/blog/Paywall';
import FollowButton from '@/components/blog/FollowButton';
import ClapButton from '@/components/blog/ClapButton';
import ResponsiveImage from '@/components/blog/ResponsiveImage';
import ReaderModeToggle from '@/components/blog/ReaderModeToggle';
import { StreamVideoPlayer } from '@/components/blog/StreamVideoPlayer';
import { SEO } from '@/components/seo/SEO';
import { SchemaOrg } from '@/components/seo/SchemaOrg';
import { generateArticleSchema } from '@/lib/seo-utils';

import { MessageSquare, ThumbsUp, Share2, Bookmark } from 'lucide-react';
import './Article.css';

const Article = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await api.getPostBySlug(slug);
                setPost(data);
            } catch (error) {
                console.error('Failed to fetch post', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (isLoading) return <div className="container py-12 text-center">Loading...</div>;
    if (!post) return <div className="container py-12 text-center">Post not found</div>;

    return (
        <ArticleShell>
            <SEO
                title={post.title}
                description={post.excerpt}
                type="article"
                openGraph={{ image: post.coverImage }}
                twitter={{ creator: `@${post.author?.name}` }}
            />
            <SchemaOrg schema={generateArticleSchema({
                headline: post.title,
                image: post.coverImage,
                datePublished: post.publishedAt,
                authorName: post.author?.name,
                description: post.excerpt,
                url: window.location.href
            })} />

            <header className="article-header">
                <div className="article-meta">
                    <div className="flex items-center gap-3 mb-6">
                        <Avatar src={post.author?.avatar} alt={post.author?.name} />
                        <div>
                            <div className="font-medium flex items-center gap-2">
                                {post.author?.name}
                                <FollowButton authorId={post.author?.id} />
                            </div>
                            <div className="text-sm text-muted">
                                {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(post.publishedAt))} · {post.readTime} read
                            </div>
                        </div>
                    </div>
                </div>

                <h1 className="article-title">{post.title}</h1>
                <p className="article-excerpt">{post.excerpt}</p>
            </header>

            <figure className="article-cover">
                <ResponsiveImage src={post.coverImage} alt={post.title} aspectRatio="21/9" />
            </figure>

            <div className="article-content">
                {/* Mock Content */}
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <h2>The Core Concept</h2>
                <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>

                <div className="my-8">
                    <StreamVideoPlayer src="https://customer-m033z5x00ks6nunl.cloudflarestream.com/b236bde30eb07b9d01318c4060ea1120/manifest/video.m3u8" poster="https://customer-m033z5x00ks6nunl.cloudflarestream.com/b236bde30eb07b9d01318c4060ea1120/thumbnails/thumbnail.jpg" />
                    <p className="text-sm text-muted text-center mt-2">Figure 1: Demonstration of Cloudflare Stream integration</p>
                </div>

                <blockquote>
                    "Simplicity is the ultimate sophistication." - Leonardo da Vinci
                </blockquote>
                <p>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
            </div>

            <div className="article-tags">
                {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
            </div>

            <div className="article-actions">
                <div className="flex gap-4 items-center">
                    <ClapButton initialCount={post.claps} />
                    <Button variant="ghost" size="sm" className="gap-2">
                        <MessageSquare size={20} /> {post.comments}
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon"><Bookmark size={20} /></Button>
                    <Button variant="ghost" size="icon"><Share2 size={20} /></Button>
                </div>
            </div>

            <Paywall />
            <Comments />
            <div className="fixed bottom-8 right-8 z-50">
                <ReaderModeToggle />
            </div>
        </ArticleShell>
    );
};

export default Article;
