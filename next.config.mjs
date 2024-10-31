/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/schedule",
        destination: "/schedule"
      }
    ];
  }
};

export default nextConfig;
  