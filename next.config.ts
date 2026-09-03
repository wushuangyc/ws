import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloud Agent / LAN previews are not localhost; Next 16 blocks those
  // origins from loading /_next assets unless they are allowlisted.
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "172.30.0.2",
    "*.cursor.com",
    "*.cursor.sh",
    "*.oncursor.com",
  ],
};

export default nextConfig;
