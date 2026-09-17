'use client'

import { useEffect, useState } from 'react'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import {
  getRememberedBrowseHref,
  rememberBrowseView,
} from '@/lib/lastBrowseView'

/** Persistent header controls — language + context slot. Must not remount on nav open/close. */
export default function NavPersistentRow() {
  const locale = useLocale()
  const t = useTranslations()
  const pathname = usePathname()
  const router = useRouter()
  const [browseHref, setBrowseHref] = useState<'/' | '/map'>('/')

  const isListView = pathname === '/'
  const isMapView = pathname === '/map'
  const showViewToggle = isListView || isMapView

  useEffect(() => {
    if (isListView) {
      rememberBrowseView('list')
      return
    }
    if (isMapView) {
      rememberBrowseView('map')
      return
    }
    setBrowseHref(getRememberedBrowseHref())
  }, [isListView, isMapView])

  const switchLocale = () => {
    const nextLocale = locale === 'en' ? 'de' : 'en'
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <div className="flex h-8 items-center gap-3 pointer-events-auto">
      <button
        type="button"
        onClick={switchLocale}
        className="flex h-8 items-center text-switch-label uppercase tracking-widest text-text-dark hover:opacity-70 transition-opacity duration-200"
        aria-label={locale === 'en' ? 'Switch to Deutsch' : 'Switch to English'}
      >
        <span className={locale === 'en' ? 'opacity-100' : 'opacity-35'}>EN</span>
        <span className="mx-1.5 opacity-50" aria-hidden>
          ⇄
        </span>
        <span className={locale === 'de' ? 'opacity-100' : 'opacity-35'}>DE</span>
      </button>

      {showViewToggle ? (
        <div
          className="flex h-8 items-center rounded-[12px] bg-black/[0.06] p-0.5"
          role="group"
          aria-label={`${t('map')} / ${t('list')}`}
        >
          <button
            type="button"
            onClick={() => {
              if (!isMapView) router.push('/map')
            }}
            className={`
              flex h-full items-center rounded-[10px] px-2.5
              text-switch-label uppercase tracking-widest
              transition-colors duration-200
              ${
                isMapView
                  ? 'bg-paint-charcoal text-paint-warm-white'
                  : 'bg-transparent text-[#888] hover:text-text-dark'
              }
            `}
            aria-pressed={isMapView}
          >
            {t('map')}
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isListView) router.push('/')
            }}
            className={`
              flex h-full items-center rounded-[10px] px-2.5
              text-switch-label uppercase tracking-widest
              transition-colors duration-200
              ${
                isListView
                  ? 'bg-paint-charcoal text-paint-warm-white'
                  : 'bg-transparent text-[#888] hover:text-text-dark'
              }
            `}
            aria-pressed={isListView}
          >
            {t('list')}
          </button>
        </div>
      ) : (
        <Link
          href={browseHref}
          className="flex h-8 items-center text-switch-label uppercase tracking-widest text-text-primary hover:opacity-70 transition-opacity duration-200"
        >
          {t('backToBrowse')}
        </Link>
      )}
    </div>
  )
}
