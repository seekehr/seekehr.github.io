/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // GitHub Pages configuration
  // For username.github.io repositories, basePath should be empty (served from root)
  // For project pages, set basePath to '/repository-name'
  basePath: process.env.BASE_PATH || '',
  assetPrefix: process.env.ASSET_PREFIX || process.env.BASE_PATH || '',
  trailingSlash: true,
}

export default nextConfig
