import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

import Comments from '@/components/Comments';

import { Metadata } from 'next';
import Image from 'next/image';

import { calculateReadingTime } from '@/lib/utils';

type Params = { slug: string };

type FrontmatterData = {
  title: string;
  description: string;
  pubDate: string;
  author: string;
  image: string;
  tags: string[];
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const awaitedParams = await params;
  const { slug } = awaitedParams;
  const filePath = path.join(process.cwd(), 'src/content/blog', `${slug}.md`);
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const result = matter(fileContent);
  const data = result.data as FrontmatterData;

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

const PostPage = async ({ params }: { params: Promise<Params> }) => {
  const awaitedParams = await params;
  const { slug } = awaitedParams;
  const filePath = path.join(process.cwd(), 'src/content/blog', `${slug}.md`);
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const result = matter(fileContent);
  const data = result.data as FrontmatterData;
  const content = result.content;
  const readingTime = calculateReadingTime(content);

  return (
    <>
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white">{data.title}</h1>
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex items-center space-x-2">
            <Image src="/images/author.png" alt={data.author} width={40} height={40} className="w-10 h-10 rounded-full" />
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
        {data.image && <Image src={data.image} alt={data.title} width={800} height={400} className="w-full h-auto rounded-lg mb-8" />} 
        <div
          className="prose dark:prose-invert max-w-none text-lg leading-8"
          dangerouslySetInnerHTML={{ __html: (await marked(content)) as string }}
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
  const files = await fs.readdir(path.join(process.cwd(), blogDir));

  return files.map(filename => ({
    slug: filename.replace('.md', ''),
  }));
}
