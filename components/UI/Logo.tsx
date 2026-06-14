"use client"

import { useContext } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { HistoryContext } from '@/providers/HistoryProvider'
import ColorLogo from '@/svgs/colorLogo'

export default function Logo() {
  const t = useTranslations()
  const [history] = useContext(HistoryContext)

  const isMenuOpen = history.navOpen

  return (
    <div
      className={`
        fixed top-5 z-nav-chrome w-logo transition-all duration-fast ease-in-out
        will-change-transform transform-gpu pointer-events-none
        ${isMenuOpen ? 'left-[calc(100%-320px)] l:left-[calc(100%-270px)]' : 'left-5'}
      `}
    >
      <div className="w-full">
        <ColorLogo />
      </div>

      <p className="mt-1 text-logo-tag font-normal text-text-primary opacity-80">
        {t('paintingPhotographyAndHistory')}
      </p>

      <p className="text-logo-by font-medium text-black mt-1">
        {t('by')}{' '}
        <span className="font-extrabold">Bernard Bolter</span>
      </p>
    </div>
  )
}
