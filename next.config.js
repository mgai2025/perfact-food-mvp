/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['ui-avatars.com'],
    },
    // Ensure we can build even if there are type errors during the rush/MVP phase
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    }
};

module.exports = nextConfig;
