import {getRequestConfig} from 'next-intl/server'
import {routing} from './routing'

export default getRequestConfig(async ({requestLocale}) => {
// We must await the locale in Next.js 15
const locale = await requestLocale;

// Validates if the locale exists in our config
const isSupported = routing.locales.some((l) => l === locale);
const finalLocale = isSupported ? locale : routing.defaultLocale;

const messages = (await import(`../messages/${finalLocale}.json`)).default

return {
        locale: finalLocale,
        messages: messages
    };
})