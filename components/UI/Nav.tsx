'use client'

import { useEffect, useRef, useState } from 'react'
import { Link, usePathname } from '@/i18n/routing'
import { useHistory } from '@/providers/HistoryProvider'
import { useTranslations } from 'next-intl'
import NavPersistentRow from '@/components/UI/NavPersistentRow'

type NavPhase = 'closed' | 'open' | 'closing'

const CLOSE_LINKS_MS = 150
const PANEL_OPEN_DELAY_MS = 350

type NavLink = {
  href: string
  labelKey: string
}

type NavGroup = {
  labelKey: string
  links: NavLink[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    labelKey: 'browse',
    links: [
      { href: '/', labelKey: 'list' },
      { href: '/map', labelKey: 'map' },
    ],
  },
  {
    labelKey: 'series',
    links: [
      { href: '/series/mediums-of-perception', labelKey: 'mediumsOfPerception' },
    ],
  },
  {
    labelKey: 'more',
    links: [
      { href: '/experience', labelKey: 'experience' },
      { href: '/neighborhood', labelKey: 'neighborhoodCommissions' },
      { href: '/store', labelKey: 'artPrints' },
      { href: '/about', labelKey: 'about' },
    ],
  },
]

export default function Nav() {
  const [history, setHistory] = useHistory()
  const t = useTranslations()
  const pathname = usePathname()
  const [phase, setPhase] = useState<NavPhase>('closed')
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isMenuOpen = history.navOpen
  const panelVisible = phase === 'open' || phase === 'closing'
  const linksEnter = phase === 'open'
  const linksExit = phase === 'closing'
  const scrimVisible = panelVisible

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [])

  const openMenu = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setHistory((state) => ({ ...state, navOpen: true }))
    setPhase('open')
  }

  const closeMenu = () => {
    if (phase === 'closing' || phase === 'closed') return
    setPhase('closing')
    closeTimer.current = setTimeout(() => {
      setHistory((state) => ({ ...state, navOpen: false }))
      setPhase('closed')
      closeTimer.current = null
    }, CLOSE_LINKS_MS)
  }

  const toggleMenu = () => {
    if (isMenuOpen || phase === 'open' || phase === 'closing') {
      closeMenu()
    } else {
      openMenu()
    }
  }

  const navLinkClass = (href: string) =>
    `text-nav-link hover:underline ${
      pathname === href ? 'text-text-primary underline' : 'text-text-dark'
    }`

  const linkMotionClass = linksExit
    ? 'opacity-0 translate-x-8 transition-[opacity,transform] duration-[150ms] ease-in-out delay-0'
    : linksEnter
      ? 'opacity-100 translate-x-0 transition-[opacity,transform] duration-[220ms] ease-in'
      : 'opacity-0 translate-x-full'

  /** Stagger by group, then by link. Lands ~400–450ms after open click. */
  const linkDelayMs = (groupIndex: number, linkIndex: number) =>
    PANEL_OPEN_DELAY_MS + 60 + groupIndex * 80 + linkIndex * 40

  return (
    <section className="w-full">
      <div
        className={`
          fixed right-0 z-nav-chrome
          transition-[top] duration-fast ease-in-out
          ${isMenuOpen ? 'top-14' : 'top-2.5'}
        `}
      >
        <div className="nav-chrome-cluster chrome-surface chrome-surface--from-right">
          <NavPersistentRow />

          <button
            type="button"
            className="nav-menu-toggle relative focus:outline-none"
            onClick={toggleMenu}
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
      </div>

      {/* Backdrop scrim — behind panel, above page */}
      <button
        type="button"
        aria-label="Close menu"
        tabIndex={scrimVisible ? 0 : -1}
        onClick={closeMenu}
        className={`
          fixed inset-0 z-[90] border-0 p-0
          bg-black/45 cursor-pointer
          transition-opacity duration-fast ease-in-out
          ${scrimVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          ${isMenuOpen && phase === 'open' ? 'delay-[350ms]' : 'delay-0'}
        `}
      />

      <nav
        id="navigation"
        aria-hidden={!panelVisible}
        className={`
          fixed inset-x-0 top-0 z-nav-menu w-full
          bg-[#FBFAF7]
          ease-in-out transition-transform duration-fast
          ${panelVisible ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}
          ${isMenuOpen && phase === 'open' ? 'delay-[350ms]' : 'delay-0'}
          l:right-0 l:left-auto l:w-nav-panel l:min-h-[470px] l:h-auto
        `}
      >
        {/*
          Panel padding 112px 24px 20px (pt-28 px-6 pb-5).
          Horizontal/bottom match brief-08. Top is 112px so content clears
          the overlay chrome cluster (open state sits at top-14, outside
          the panel — 56px would put Browse under the hamburger).
          Settled: docs/artwork/decision-four-open-calls-pass-2.md §4.
        */}
        <div className="px-6 pb-5 pt-28">
          <div className="flex flex-col items-end gap-[26px] overflow-hidden">
            {NAV_GROUPS.map((group, groupIndex) => (
              <div key={group.labelKey} className="w-fit max-w-full text-right">
                <div
                  className={`mb-2 ${linkMotionClass}`}
                  style={
                    linksEnter
                      ? { transitionDelay: `${linkDelayMs(groupIndex, 0)}ms` }
                      : undefined
                  }
                >
                  <div className="mb-2 h-px w-full bg-[#999]/50" aria-hidden />
                  <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-[#999]">
                    {t(group.labelKey)}
                  </p>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {group.links.map((link, linkIndex) => {
                    const style = linksEnter
                      ? { transitionDelay: `${linkDelayMs(groupIndex, linkIndex)}ms` }
                      : undefined

                    return (
                      <li key={link.labelKey} className={linkMotionClass} style={style}>
                        <Link
                          href={link.href}
                          className={`inline-block py-1.5 ${navLinkClass(link.href)}`}
                          onClick={closeMenu}
                        >
                          {t(link.labelKey)}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </nav>
    </section>
  )
}
