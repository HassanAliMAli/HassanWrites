import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/HassanWrites',
  assetPrefix: '/HassanWrites/',
  reactCompiler: true,
};

const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

export default withPWAConfig(nextConfig);
