import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'de'] as const,
  defaultLocale: 'en',
  localePrefix: 'always',        // → /en/store/...   /de/store/...
});