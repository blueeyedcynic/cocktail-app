/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.css': {
          loaders: ['@tailwindcss/postcss'],
        },
      },
    },
  },
};

export default nextConfig;