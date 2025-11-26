import React from 'react';
import { Link } from 'react-router-dom';

import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import './PostCard.css';

const PostCard = ({ post }) => {
    return (
        <article className="post-card">
            <Link to={`/post/${post.slug}`} className="post-card__image-link">
                <div className="post-card__image-wrapper">
                    <img src={post.coverImage} alt={post.title} className="post-card__image" loading="lazy" />
                </div>
            </Link>

            <div className="post-card__content">
                <div className="post-card__meta">
                    <Badge variant="secondary" className="post-card__tag">{post.tags[0]}</Badge>
                    <span className="post-card__date">
                        {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(post.publishedAt))}
                    </span>
                </div>

                <Link to={`/post/${post.slug}`} className="post-card__title-link">
                    <h3 className="post-card__title">{post.title}</h3>
                </Link>

                <p className="post-card__excerpt">{post.excerpt}</p>

                <div className="post-card__footer">
                    <div className="post-card__author">
                        <Avatar src={post.author.avatar} alt={post.author.name} size="sm" />
                        <span className="post-card__author-name">{post.author.name}</span>
                    </div>
                    <span className="post-card__read-time">{post.readTime} read</span>
                </div>
            </div>
        </article>
    );
};

export { PostCard };
