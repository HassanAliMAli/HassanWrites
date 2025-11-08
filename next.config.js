// const withPWA = require('next-pwa');
// const withBundleAnalyzer = require('@next/bundle-analyzer');

const nextConfig = {
  output: 'export',
  basePath: '/HassanWrites',
  assetPrefix: '/HassanWrites/',
  reactCompiler: true,
  serverExternalPackages: ['flexsearch'],
  turbopack: {},
};

// const withPWAConfig = withPWA({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
// });

// const bundleAnalyzer = withBundleAnalyzer({
//   enabled: process.env.ANALYZE === 'true',
// });

module.exports = nextConfig;
// module.exports = bundleAnalyzer(withPWAConfig(nextConfig));