import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET() {
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

  return NextResponse.json(posts);
}
