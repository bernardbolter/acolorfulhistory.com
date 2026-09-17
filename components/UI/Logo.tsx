'use client'

import { useContext } from 'react'
import { useTranslations } from 'next-intl'
import { HistoryContext } from '@/providers/HistoryProvider'
import ColorLogo from '@/svgs/colorLogo'

export default function Logo() {
  const t = useTranslations()
  const [history] = useContext(HistoryContext)

  const isMenuOpen = history.navOpen
  // Open-state shift: calc(100% - 318px). Tied to ColorLogo 298px + 1.25rem
  // left chrome. 270px is superseded — decision-four-open-calls-pass-2.md §2.
  const openShiftClass = 'left-[calc(100%-318px)]'

  return (
    <>
      <div
        className={`
          fixed top-5 z-nav-chrome
          transition-[left] duration-fast ease-in-out
          will-change-[left] pointer-events-none
          ${isMenuOpen ? openShiftClass : 'left-0'}
        `}
      >
        <div className="logo-wordmark-chrome chrome-surface chrome-surface--from-left chrome-surface--soft chrome-surface--static">
          <ColorLogo />
        </div>
      </div>

      <div
        className={`
          logo-chrome-stack fixed top-5 left-0 z-nav-chrome
          pointer-events-none
          transition-opacity duration-300 ease-in-out
          ${isMenuOpen ? 'opacity-0' : 'opacity-100'}
        `}
        aria-hidden={isMenuOpen}
      >
        <div className="logo-chrome-spacer" aria-hidden />

        <div className="logo-meta-chrome chrome-surface chrome-surface--from-left chrome-surface--soft chrome-surface--static">
          <p className="text-logo-tag font-normal text-text-primary opacity-80">
            {t('logoTagline')}
          </p>

          <p className="text-logo-by font-medium text-text-dark/80">
            {t('by')}{' '}
            <a
              href="https://bernardbolter.com"
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={isMenuOpen ? -1 : undefined}
              className={`
                inline-block
                text-[0.9375rem] font-bold leading-none tracking-[0.03em]
                text-text-dark/80
                transition-[letter-spacing,color] duration-300 ease-out
                hover:tracking-[0.06em] hover:text-text-dark
                focus-visible:outline-none focus-visible:text-text-dark
                ${isMenuOpen ? 'pointer-events-none' : 'pointer-events-auto'}
              `}
            >
              Bernard Bolter
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
