/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://logistics-backend-1-2hy1.onrender.com/api/v1',
  },
}

module.exports = nextConfig
