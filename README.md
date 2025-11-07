# HassanWrites Blog

A Medium-like blog built with Next.js, deployed on GitHub Pages.

## Features

- Static site generation with Next.js
- Dark/Light theme support
- PWA (Progressive Web App) support
- Search functionality with FlexSearch
- RSS feed generation
- Markdown-based blog posts
- Responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/your-repo-name.git
```

2. Install dependencies:
```bash
npm install
```

### Development

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

The built site will be in the `out` directory.

## Deployment to GitHub Pages

### Using GitHub Actions (Recommended)

1. Update the `basePath` and `assetPrefix` in `next.config.js` to match your repository name:
```js
basePath: '/your-repo-name',
assetPrefix: '/your-repo-name/',
```

2. Create a `.github/workflows/deploy.yml` file with the following content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      - run: npm install
      - run: npm run build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
          cname: your-domain.com # Remove this line if you're not using a custom domain
```

3. In your GitHub repository settings, ensure GitHub Pages is enabled and set to use the `gh-pages` branch.

### Manual Deployment

1. Build the project:
```
npm run build
```

2. The output will be in the `out` directory. You can serve these files using any static server.

## Customization

### Blog Posts

Blog posts are located in `src/content/blog/`. Create new `.md` files in this directory to add new posts.

### Configuration

- Update metadata in `src/app/layout.tsx`
- Modify styling in `src/app/globals.css`
- Adjust theme settings in `src/components/ThemeProvider.tsx`
- Update PWA settings in `next.config.js`

### Environment Variables

The site supports the following environment variables (create a `.env.local` file):

- `NEXT_PUBLIC_BASE_PATH` - Base path for the site (when hosted in a subdirectory)

## Project Structure

```
src/
├── app/          # Next.js 13+ App Router pages
├── components/   # React components
├── content/      # Blog posts (Markdown files)
├── lib/          # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Search powered by [FlexSearch](https://github.com/nextapps-de/flexsearch)
- PWA features with [next-pwa](https://github.com/shadowwalker/next-pwa)