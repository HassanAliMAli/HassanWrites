import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import RSS from 'rss';

export function generateRssFeed() {
  const siteUrl = 'https://HassanAliMAli.github.io/HassanWrites';
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

  const feed = new RSS({
    title: 'HassanWrites',
    description: 'A Medium-like blog built with Next.js and hosted on GitHub Pages.',
    feed_url: `${siteUrl}/rss.xml`,
    site_url: siteUrl,
    language: 'en',
  });

  posts.forEach(post => {
    feed.item({
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url: `${siteUrl}/blog/${post.slug}`,
      date: post.frontmatter.pubDate,
      author: post.frontmatter.author,
    });
  });

  const xml = feed.xml({ indent: true });
  console.log(xml);
}
