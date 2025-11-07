import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import FlexSearch from 'flexsearch';

export function generateSearchIndex() {
  try {
    const blogDir = 'src/content/blog';
    const files = fs.readdirSync(path.join(process.cwd(), blogDir));

    const posts = files.map(filename => {
      const filePath = path.join(process.cwd(), blogDir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      return {
        slug: filename.replace('.md', ''),
        title: data.title,
        description: data.description,
        content: content,
      };
    });

    const index = new FlexSearch.Document({
      document: {
        id: 'slug',
        index: ['title', 'description', 'content'],
      },
    });

    posts.forEach(post => {
      index.add(post);
    });

    const dir = path.join(process.cwd(), 'public', 'search');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    index.export((key, data) => {
      const filePath = path.join(dir, `${key}.json`);
      fs.writeFileSync(filePath, data);
    });
  } catch (error) {
    console.error("Error generating search index:", error);
  }
}

generateSearchIndex();
