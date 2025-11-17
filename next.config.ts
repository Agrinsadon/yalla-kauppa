import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/**",
      },
    ],
  },
  serverActions: {
    // Allow slightly larger payloads for image data URLs (base64 expands file size).
    bodySizeLimit: "4mb",
  },
};

export default nextConfig;
