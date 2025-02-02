/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "7csbud5epbbjomgy.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
