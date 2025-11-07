"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRssFeed = generateRssFeed;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const gray_matter_1 = __importDefault(require("gray-matter"));
const rss_1 = __importDefault(require("rss"));
function generateRssFeed() {
    const siteUrl = 'https://HassanAliMAli.github.io/HassanWrites';
    const blogDir = 'src/content/blog';
    const files = fs_1.default.readdirSync(path_1.default.join(process.cwd(), blogDir));
    const posts = files.map(filename => {
        const filePath = path_1.default.join(process.cwd(), blogDir, filename);
        const fileContent = fs_1.default.readFileSync(filePath, 'utf-8');
        const { data } = (0, gray_matter_1.default)(fileContent);
        return {
            slug: filename.replace('.md', ''),
            frontmatter: data,
        };
    });
    const feed = new rss_1.default({
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
