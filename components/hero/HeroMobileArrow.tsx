'use client'

import RightArrow from '@/svgs/RightArrow'

interface HeroMobileArrowProps {
  onAdvance: () => void
  disabled: boolean
  currentStep: number
  totalSteps: number
}

export default function HeroMobileArrow({
  onAdvance,
  disabled,
  currentStep,
  totalSteps,
}: HeroMobileArrowProps) {
  return (
    <div className="hero-mobile-controls absolute inset-x-0 bottom-6 z-20 flex justify-center l:hidden">
      <button
        type="button"
        onClick={onAdvance}
        disabled={disabled}
        className="hero-mobile-arrow flex h-12 w-12 items-center justify-center rounded-full border border-surface-warm-white/40 bg-paint-charcoal/50 text-surface-warm-white backdrop-blur-sm transition-opacity disabled:opacity-30"
        aria-label={
          disabled
            ? 'Hero sequence complete'
            : `Advance hero animation, step ${currentStep + 1} of ${totalSteps}`
        }
      >
        <RightArrow />
      </button>
    </div>
  )
}
