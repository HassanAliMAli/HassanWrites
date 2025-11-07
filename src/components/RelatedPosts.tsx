'use client';

import { useEffect, useState } from 'react';

import AccessibleLink from './AccessibleLink';

type Post = {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    tags: string[];
  };
};

type RelatedPostsProps = {
  currentPost: {
    slug: string;
    frontmatter: {
      tags: string[];
    };
  };
};

const RelatedPosts = ({ currentPost }: RelatedPostsProps) => {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/posts');
      const posts: Post[] = await res.json();

      const related = posts
        .filter(post => post.slug !== currentPost.slug)
        .filter(post =>
          post.frontmatter.tags.some(tag => currentPost.frontmatter.tags.includes(tag))
        )
        .slice(0, 3);

      setRelatedPosts(related);
    };

    fetchPosts();
  }, [currentPost]);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold mb-8">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {relatedPosts.map(post => (
          <div key={post.slug} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-bold">
              <AccessibleLink href={`/blog/${post.slug}`}>{post.frontmatter.title}</AccessibleLink>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{post.frontmatter.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
