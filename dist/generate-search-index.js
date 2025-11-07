"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSearchIndex = generateSearchIndex;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const gray_matter_1 = __importDefault(require("gray-matter"));
const flexsearch_1 = __importDefault(require("flexsearch"));
function generateSearchIndex() {
    try {
        const blogDir = 'src/content/blog';
        const files = fs_1.default.readdirSync(path_1.default.join(process.cwd(), blogDir));
        const posts = files.map(filename => {
            const filePath = path_1.default.join(process.cwd(), blogDir, filename);
            const fileContent = fs_1.default.readFileSync(filePath, 'utf-8');
            const { data, content } = (0, gray_matter_1.default)(fileContent);
            return {
                slug: filename.replace('.md', ''),
                title: data.title,
                description: data.description,
                content: content,
            };
        });
        const index = new flexsearch_1.default.Document({
            document: {
                id: 'slug',
                index: ['title', 'description', 'content'],
            },
        });
        posts.forEach(post => {
            index.add(post);
        });
        const dir = path_1.default.join(process.cwd(), 'public', 'search');
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        index.export((key, data) => {
            const filePath = path_1.default.join(dir, `${key}.json`);
            fs_1.default.writeFileSync(filePath, data);
        });
    }
    catch (error) {
        console.error("Error generating search index:", error);
    }
}
generateSearchIndex();
