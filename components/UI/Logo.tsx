"use client"

import { useContext } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { HistoryContext } from '@/providers/HistoryProvider'
import ColorLogo from '@/svgs/colorLogo'

export default function Logo() {
  const t = useTranslations()
  const locale = useLocale()
  const [history] = useContext(HistoryContext)

  const isMenuOpen = history.navOpen

  return (
    <div
      className={`
        fixed top-5 z-[9999] w-[200px] transition-all duration-1000 ease-in-out
        will-change-transform transform-gpu
        ${isMenuOpen 
          ? 'left-[calc(100%-320px)] lg:left-[calc(100%-320px)]' 
          : 'left-5'}
        bg-yellow-200/50 p-2 rounded-lg
        pointer-events-none
      `}
    >
      {/* Debug text – remove later */}
      <p className="text-xs text-red-600 mb-1">
        Debug: Menu open = {String(isMenuOpen)} | Current left = {isMenuOpen ? 'calc(100%-320px)' : '20px'}
      </p>

      <div className="w-full">
        <ColorLogo />
      </div>

      <p className="mt-1 text-xs font-light text-gray-700 opacity-80">
        {t('paintingPhotographyAndHistory')}
      </p>

      <p className="text-[10px] font-bold text-black mt-1">
        {t('by')} <span className="font-extrabold">Bernard Bolter</span>
      </p>
    </div>
  )
}