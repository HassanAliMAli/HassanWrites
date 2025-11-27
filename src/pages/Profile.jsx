import React from 'react';
import { ArticleShell } from '@/components/layout/ArticleShell';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { PostCard } from '@/components/blog/PostCard';
import FollowButton from '@/components/blog/FollowButton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { SEO } from '@/components/seo/SEO';
import { SchemaOrg } from '@/components/seo/SchemaOrg';
import { generatePersonSchema } from '@/lib/seo-utils';
import './Profile.css';

const Profile = () => {
    const author = {
        id: '1',
        name: 'Hassan',
        bio: 'Tech enthusiast and writer. Building the future of web.',
        avatar: 'https://ui-avatars.com/api/?name=Hassan&background=6366f1&color=fff',
        stats: {
            posts: 12,
            followers: 1200,
            following: 45
        }
    };

    return (
        <ArticleShell>
            <SEO
                title={author.name}
                description={author.bio}
                type="profile"
                openGraph={{ image: author.avatar }}
            />
            <SchemaOrg schema={generatePersonSchema({
                name: author.name,
                image: author.avatar,
                url: window.location.href
            })} />

            <div className="profile-header">
                <Avatar src={author.avatar} alt={author.name} size="xl" />
                <div className="profile-info">
                    <h1 className="profile-name">{author.name}</h1>
                    <p className="profile-bio">{author.bio}</p>
                    <div className="profile-actions">
                        <FollowButton authorId={author.id} initialIsFollowing={true} />
                        <div className="profile-stats mt-4 flex gap-4 text-sm">
                            <span><strong>{author.stats.posts}</strong> Posts</span>
                            <span><strong>{author.stats.followers}</strong> Followers</span>
                            <span><strong>{author.stats.following}</strong> Following</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-tabs-wrapper">
                <Tabs defaultValue="stories">
                    <TabsList className="mb-8">
                        <TabsTrigger value="stories">Stories</TabsTrigger>
                        <TabsTrigger value="about">About</TabsTrigger>
                    </TabsList>

                    <TabsContent value="stories">
                        <div className="profile-content">
                            <p className="text-muted text-center py-12">No stories yet.</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="about">
                        <div className="profile-content">
                            <p className="text-muted text-center py-12">About content goes here.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </ArticleShell>
    );
};

export default Profile;
