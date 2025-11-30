import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { ArticleShell } from '@/components/layout/ArticleShell';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
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
            } catch {
                // Error handled silently
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (isLoading) {
        return (
            <ArticleShell>
                <div className="article-header animate-pulse">
                    <div className="article-meta mb-6">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                    </div>
                    <Skeleton className="h-12 w-3/4 mb-4" />
                    <Skeleton className="h-6 w-full mb-8" />
                </div>
                <Skeleton className="w-full aspect-[21/9] rounded-xl mb-12" />
                <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </ArticleShell>
        );
    }
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
                                {post.is_premium === 1 && <Badge variant="default" className="ml-2">Premium</Badge>}
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
                {/* If premium and no access, show excerpt only */}
                {post.is_premium === 1 && !post.has_access ? (
                    <div className="premium-preview">
                        <div dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }} />
                        <div className="fade-out-overlay"></div>
                    </div>
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                )}
            </div>

            <div className="article-tags">
                {post.tags && post.tags.map(tag => (
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

            {post.is_premium === 1 && !post.has_access && (
                <Paywall tier={post.subscription_tier || 'premium'} />
            )}

            <Comments />
            <div className="fixed bottom-8 right-8 z-50">
                <ReaderModeToggle />
            </div>
        </ArticleShell>
    );
};

export default Article;
