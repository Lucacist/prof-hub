import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // On autorise les images venant d'UploadThing pour plus tard
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
  // Cette configuration Webpack résout le problème du fichier .md
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source', // Traite les .md comme du texte brut, pas du code
    });
    return config;
  },
};

export default nextConfig;