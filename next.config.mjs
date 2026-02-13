/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
                pathname: '**',
            },
        ],
    },
    eslint: {
        // Disable ESLint during builds to avoid serialization issues
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Optional: ignore TypeScript errors during builds if needed
        // ignoreBuildErrors: true,
    },
};

export default nextConfig;
