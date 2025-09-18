/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Remove or comment out this line
  images: {
    unoptimized: true, // Optional: Keep if you don’t need image optimization
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;