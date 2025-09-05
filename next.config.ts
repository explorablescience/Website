import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
    assetPrefix: "/",
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: '',
                pathname: '/**',
            },
        ],
    }
};

export default nextConfig;
