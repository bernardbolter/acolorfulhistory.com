import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'artism.org',
        pathname: '/bolter/wp-content/uploads/**', 
      },
    ],
  },
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);