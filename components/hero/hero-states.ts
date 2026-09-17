import type { CSSProperties } from 'react'

export interface HeroPaintField {
  id: string
  /** Tailwind background class — design-system token, no raw hex. */
  colorClass: string
  style: CSSProperties
}

export interface HeroStateConfig {
  id: number
  copy: string
  /** Timeline position 0–1 where this state's copy is fully visible. */
  progress: number
  /** Placeholder copy — Bernard will revise before launch. */
  copyPending?: boolean
  /** Copy colour class — light fields need dark text from state 3 onward. */
  copyClassName?: string
}

/** Brandenburg painted fields — positions approximate the real painting composition. */
export const BRANDENBURG_FIELDS: HeroPaintField[] = [
  {
    id: 'sky-warm',
    colorClass: 'bg-paint-sky-warm',
    style: { left: '0%', top: '0%', width: '100%', height: '38%' },
  },
  {
    id: 'mid-grey',
    colorClass: 'bg-paint-mid-grey',
    style: { left: '0%', top: '36%', width: '34%', height: '64%' },
  },
  {
    id: 'cream',
    colorClass: 'bg-paint-cream',
    style: {
      left: '0%',
      top: '38%',
      width: '58%',
      height: '62%',
      clipPath: 'polygon(0% 0%, 72% 100%, 0% 100%)',
    },
  },
  {
    id: 'burnt-amber',
    colorClass: 'bg-paint-burnt-amber',
    style: { left: '74%', top: '32%', width: '26%', height: '68%' },
  },
]

/** Kottbusser Tor painted fields — no photograph; fields only. */
export const KOTTBUSSER_FIELDS: HeroPaintField[] = [
  {
    id: 'sky-vivid',
    colorClass: 'bg-paint-sky-vivid',
    style: { left: '0%', top: '0%', width: '100%', height: '52%' },
  },
  {
    id: 'warm-white',
    colorClass: 'bg-surface-warm-white',
    style: { left: '0%', top: '48%', width: '100%', height: '52%' },
  },
]

/** Final size of the paint-gate box — small and contained throughout States 3–5. */
export const HERO_GATE_SIZE = { width: '24%', height: '32%' }

// TODO: Bernard's final State 3–5 copy pass — structure is final, words may change.
export const HERO_STATES: HeroStateConfig[] = [
  { id: 0, copy: 'Berlin, 1899', progress: 0 },
  {
    id: 1,
    copy: 'A photograph transferred to canvas. The rest, painted.',
    progress: 0.18,
  },
  {
    id: 2,
    copy:
      'The painted fields freeze the present day and bring the past to the present.',
    progress: 0.4,
  },
  {
    id: 3,
    copy: 'This one was never found.',
    progress: 0.58,
    copyPending: true,
    copyClassName: 'text-paint-charcoal',
  },
  {
    id: 4,
    copy: 'So this is what took its place.',
    progress: 0.74,
    copyPending: true,
    copyClassName: 'text-paint-charcoal',
  },
  {
    id: 5,
    copy: 'See the work',
    progress: 0.9,
    copyPending: true,
    copyClassName: 'text-paint-charcoal',
  },
]

/** End-of-timeline progress (state 5 hold). */
export const HERO_TIMELINE_END = 1

/** Discrete progress stops for mobile arrow — one tap per state transition. */
export const HERO_MOBILE_STOPS = HERO_STATES.map((state) => state.progress).concat(
  HERO_TIMELINE_END
)
