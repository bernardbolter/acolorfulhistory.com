// src/i18n/request.ts   ← MUST be exactly this
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // This is the key: use requestLocale, not params
  let locale = await requestLocale;

  // Fallback if for some reason it's still undefined
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`@/i18n/messages/${locale}.json`)).default
  };
});