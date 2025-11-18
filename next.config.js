/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: '/api/proxy/api/v1',
  },
};

module.exports = nextConfig;
