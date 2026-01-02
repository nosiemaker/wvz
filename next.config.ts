import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export is problematic with dynamic routes in client components
  // For Capacitor, we'll use a different approach
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes for proper routing
  trailingSlash: true,
};

export default nextConfig;
