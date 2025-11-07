import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

const BlogPage = () => {
  const blogDir = 'src/content/blog';
  const files = fs.readdirSync(path.join(process.cwd(), blogDir));

  const posts = files.map(filename => {
    const filePath = path.join(process.cwd(), blogDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    return {
      slug: filename.replace('.md', ''),
      frontmatter: data,
    };
  });

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="space-y-8">
        {posts.map(post => (
          <div key={post.slug}>
            <h2 className="text-2xl font-bold">
              <Link href={`/blog/${post.slug}`}>{post.frontmatter.title}</Link>
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{post.frontmatter.description}</p>
            <div className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              <span>{post.frontmatter.pubDate}</span>
              <span className="mx-2">•</span>
              <span>{post.frontmatter.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
