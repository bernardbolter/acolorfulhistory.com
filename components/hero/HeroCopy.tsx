'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { Link } from '@/i18n/routing'
import { HERO_STATES } from '@/components/hero/hero-states'

export interface HeroCopyHandle {
  copyElements: HTMLElement[]
  ctaLink: HTMLElement | null
}

const HeroCopy = forwardRef<HeroCopyHandle>(function HeroCopy(_, ref) {
  const copyRefs = useRef<(HTMLElement | null)[]>([])
  const ctaRef = useRef<HTMLAnchorElement>(null)

  useImperativeHandle(ref, () => ({
    copyElements: HERO_STATES.map((state) => copyRefs.current[state.id]).filter(
      (el): el is HTMLElement => el !== null
    ),
    ctaLink: ctaRef.current,
  }))

  const bodyStates = HERO_STATES.filter((state) => state.id !== 5)
  const ctaState = HERO_STATES.find((state) => state.id === 5)

  return (
    <div className="hero-copy pointer-events-none absolute inset-x-0 bottom-0 z-10 px-6 pb-28 l:px-12 l:pb-16">
      {bodyStates.map((state) => (
        <p
          key={state.id}
          ref={(el) => {
            copyRefs.current[state.id] = el
          }}
          className={`hero-copy-line absolute bottom-28 l:bottom-16 left-6 l:left-12 max-w-md font-display text-display-sm opacity-0 l:text-display-md ${
            state.copyClassName ?? 'text-surface-warm-white'
          } ${state.copyClassName ? 'hero-copy-on-field' : ''}`}
          data-state={state.id}
        >
          {state.copy}
        </p>
      ))}

      {ctaState ? (
        <div
          ref={(el) => {
            copyRefs.current[ctaState.id] = el
          }}
          className={`hero-copy-line hero-copy-on-field absolute bottom-28 l:bottom-16 left-6 l:left-12 opacity-0`}
          data-state={ctaState.id}
        >
          <Link
            ref={ctaRef}
            href="/"
            className={`hero-cta pointer-events-auto inline-block font-display text-display-sm opacity-0 underline underline-offset-4 transition-colors l:text-display-md ${
              ctaState.copyClassName ?? 'text-surface-warm-white'
            } decoration-current/60 hover:decoration-current`}
          >
            {ctaState.copy}
          </Link>
        </div>
      ) : null}
    </div>
  )
})

export default HeroCopy
