"use client"

import { useContext } from 'react'
import { usePathname } from 'next/navigation'
import { HistoryContext } from '@/providers/HistoryProvider'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import DEflag from '@/svgs/DE'
import USflag from '@/svgs/US'

export default function Nav() {
  const [history, setHistory] = useContext(HistoryContext)
  const locale = useLocale()
  const t = useTranslations() // flat structure – no namespace needed
  const pathname = usePathname()

  const isArtworkPage =
    pathname.split('/').length === 3 &&
    pathname !== `/${locale}` &&
    !pathname.includes('/contact') &&
    !pathname.includes('/about')

  const isMenuOpen = history.navOpen

  return (
    <section className="w-full">
      {/* Top right hamburger button */}
      <div className="fixed top-2.5 right-5 z-[200]">
        <button
          className="relative w-8 h-8 bg-transparent border-none cursor-pointer focus:outline-none"
          onClick={() => setHistory((state) => ({ ...state, navOpen: !state.navOpen }))}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="navigation"
        >
          {/* Hamburger lines */}
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

      {/* Menu panel */}
      <nav
        id="navigation"
        className={`
            fixed inset-x-0 top-0 z-[100] w-full bg-nav-background/95 transition-all duration-500
            -translate-y-full
            ${isMenuOpen ? 'translate-y-0' : ''}
            lg:right-0 lg:left-auto lg:w-[300px] lg:h-[470px] lg:p-8 lg:pt-16
        `}
      >
        <div className="p-5 lg:p-8 lg:pt-16">

          {/* Map toggle + language switch */}
          <div className="flex items-center justify-between mb-6 border-b border-light-dark pb-2">
            <div className="flex gap-3">
              <button
                onClick={() => {/* switch to en – use next-intl router or cookie */}}
                className={`opacity-${locale === 'en' ? '80' : '30'} hover:opacity-100 transition-opacity`}
              >
                <div className="w-8 h-6">
                    <USflag />
                </div>
              </button>
              <button
                onClick={() => {/* switch to de */}}
                className={`opacity-${locale === 'de' ? '80' : '30'} hover:opacity-100 transition-opacity`}
              >
                <div className="w-8 h-6">
                    <DEflag />
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-light-dark pb-2">
              <Link href="/about" className="text-dark text-base hover:underline">
                → {t('about')}
              </Link>
              <Link href="/prints" className="text-dark text-base hover:underline">
                → {t('artPrints')}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </section>
  )
}