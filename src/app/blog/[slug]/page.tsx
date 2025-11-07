import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const PostPage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'src/content/blog', `${slug}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return (
    <article>
      <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
      <div className="text-sm text-gray-500 dark:text-gray-500 mb-8">
        <span>{data.pubDate}</span>
        <span className="mx-2">•</span>
        <span>{data.author}</span>
      </div>
      {data.image && <img src={data.image} alt={data.title} className="w-full h-auto rounded-lg mb-8" />} 
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: marked(content) }}
      ></div>
    </article>
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
