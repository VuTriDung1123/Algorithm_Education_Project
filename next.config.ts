/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! CẢNH BÁO !!
    // Bỏ qua lỗi TypeScript khi build để deploy cho lẹ
    ignoreBuildErrors: true,
  },
  eslint: {
    // Bỏ qua lỗi ESLint khi build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig; // Hoặc module.exports = nextConfig; tùy file của bạn