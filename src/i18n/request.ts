import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';
 
export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
 
  return {
    locale,
    // ADD THIS: Dynamically load the correct messages file.
    // NOTE: You may need to adjust the path to your messages folder 
    // (e.g., '../../messages/${locale}.json' or just './${locale}.json')
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});