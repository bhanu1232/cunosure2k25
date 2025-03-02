/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    domains: ["firebasestorage.googleapis.com"],
  },
  trailingSlash: true,
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
