import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale
  const isSupported = routing.locales.some((l) => l === locale)
  const finalLocale = isSupported ? locale : routing.defaultLocale
  const messages = (await import(`../messages/${finalLocale}.json`)).default

  return {
    locale: finalLocale,
    messages,
  }
})