import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

import Comments from '@/components/Comments';

import { Metadata } from 'next';

import { calculateReadingTime } from '@/lib/utils';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'src/content/blog', `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(fileContent);

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      url: `https://HassanAliMAli.github.io/HassanWrites/blog/${slug}`,
      images: [
        {
          url: `https://HassanAliMAli.github.io/HassanWrites${data.image}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: [`https://HassanAliMAli.github.io/HassanWrites${data.image}`],
    },
  };
}

import RelatedPosts from '@/components/RelatedPosts';

const PostPage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'src/content/blog', `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const readingTime = calculateReadingTime(content);

  return (
    <>
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white">{data.title}</h1>
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex items-center space-x-2">
            <img src="/images/author.png" alt={data.author} className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{data.author}</p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span>{data.pubDate}</span>
                <span className="mx-2">•</span>
                <span>{readingTime}</span>
              </div>
            </div>
          </div>
        </div>
        {data.image && <img src={data.image} alt={data.title} className="w-full h-auto rounded-lg mb-8" />} 
        <div
          className="prose dark:prose-invert max-w-none text-lg leading-8"
          dangerouslySetInnerHTML={{ __html: marked(content) }}
        ></div>
      </article>
      <Comments />
      <RelatedPosts currentPost={{ slug, frontmatter: data }} />
    </>
  );
};

export default PostPage;

export async function generateStaticParams() {
  const blogDir = 'src/content/blog';
  const files = fs.readdirSync(path.join(process.cwd(), blogDir));

  return files.map(filename => ({
    slug: filename.replace('.md', ''),
  }));
}
