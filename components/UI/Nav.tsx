"use client"

import { Link, usePathname, useRouter } from '@/i18n/routing'
import { useHistory } from '@/providers/HistoryProvider'
import { useTranslations, useLocale } from 'next-intl'
import DEflag from '@/svgs/DE'
import USflag from '@/svgs/US'

export default function Nav() {
  const [history, setHistory] = useHistory()
  const locale = useLocale()
  const t = useTranslations()
  const pathname = usePathname()
  const router = useRouter()

  const isMenuOpen = history.navOpen
  const showViewToggle = pathname === '/series'

  const switchLocale = (nextLocale: 'en' | 'de') => {
    if (nextLocale === locale) return
    router.replace(pathname, { locale: nextLocale })
  }

  const navLinkClass = (href: string) =>
    `text-nav-link hover:underline ${
      pathname === href ? 'text-text-primary underline' : 'text-text-dark'
    }`

  return (
    <section className="w-full">
      <div className="fixed top-2.5 right-5 z-nav-chrome">
        <button
          className="relative w-8 h-8 bg-transparent border-none cursor-pointer focus:outline-none"
          onClick={() => setHistory((state) => ({ ...state, navOpen: !state.navOpen }))}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="navigation"
        >
          <span
            className={`
              block absolute left-[7px] h-0.5 rounded-sm bg-menu-color transition-all duration-300
              ${isMenuOpen ? 'top-[20px] w-[23px] rotate-[225deg]' : 'top-[9px] w-[23px]'}
            `}
          />
          <span
            className={`
              block absolute left-[7px] h-0.5 rounded-sm bg-menu-color transition-all duration-300
              ${isMenuOpen ? 'top-[20px] opacity-0' : 'top-[16px] w-[17px]'}
            `}
          />
          <span
            className={`
              block absolute left-[7px] h-0.5 rounded-sm bg-menu-color transition-all duration-300
              ${isMenuOpen ? 'top-[20px] w-[23px] rotate-[135deg]' : 'top-[23px] w-[23px]'}
            `}
          />
          <span
            className={`
              block absolute left-[7px] h-0.5 rounded-sm bg-menu-color transition-all duration-300
              ${isMenuOpen ? 'top-[20px] opacity-0' : 'top-[30px] w-[17px]'}
            `}
          />
        </button>
      </div>

      <nav
        id="navigation"
        className={`
            fixed inset-x-0 top-0 z-nav-menu w-full bg-surface-nav/95 transition-all duration-fast
            -translate-y-full
            ${isMenuOpen ? 'translate-y-0' : ''}
            l:right-0 l:left-auto l:w-[300px] l:h-[470px] l:p-8 l:pt-16
        `}
      >
        <div className="p-5 l:p-8 l:pt-16">
          <div className="flex items-center justify-between mb-6 border-b border-surface-loader pb-2">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => switchLocale('en')}
                className={`${locale === 'en' ? 'opacity-80' : 'opacity-30'} hover:opacity-100 transition-opacity`}
                aria-label="English"
              >
                <div className="w-8 h-6">
                  <USflag />
                </div>
              </button>
              <button
                type="button"
                onClick={() => switchLocale('de')}
                className={`${locale === 'de' ? 'opacity-80' : 'opacity-30'} hover:opacity-100 transition-opacity`}
                aria-label="Deutsch"
              >
                <div className="w-8 h-6">
                  <DEflag />
                </div>
              </button>
            </div>
          </div>

          {showViewToggle && (
            <div className="mb-6 border-b border-light-dark pb-4">
              <p className="text-switch-label uppercase tracking-widest text-text-muted mb-3">
                {t('map')} / {t('list')}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`nav-view-toggle ${history.viewMap ? 'nav-view-toggle-active' : ''}`}
                  onClick={() => setHistory((state) => ({ ...state, viewMap: true }))}
                >
                  {t('map')}
                </button>
                <button
                  type="button"
                  className={`nav-view-toggle ${!history.viewMap ? 'nav-view-toggle-active' : ''}`}
                  onClick={() => setHistory((state) => ({ ...state, viewMap: false }))}
                >
                  {t('list')}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Link href="/" className={`block ${navLinkClass('/')}`}>
              → {t('home')}
            </Link>
            <Link href="/series" className={`block ${navLinkClass('/series')}`}>
              → {t('series')}
            </Link>
            <Link
              href="/series/mediums-of-perception"
              className={`block ${navLinkClass('/series/mediums-of-perception')}`}
            >
              → {t('mediumsOfPerception')}
            </Link>
            <Link href="/experience" className={`block ${navLinkClass('/experience')}`}>
              → {t('experience')}
            </Link>
          </div>
        </div>
      </nav>
    </section>
  )
}
