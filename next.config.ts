import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'bernardbolter.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'pub-6a869efbfec4404396a52a3b7056bfc7.r2.dev',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
