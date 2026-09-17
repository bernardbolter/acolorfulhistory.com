import gsap from 'gsap'
import { HERO_GATE_SIZE, HERO_STATES, HERO_TIMELINE_END } from '@/components/hero/hero-states'

export interface HeroTimelineRefs {
  section: HTMLElement
  photoWrap: HTMLElement
  brandenburgPhoto: HTMLElement
  brandenburgFields: HTMLElement[]
  kottbusserFields: HTMLElement[]
  gate: HTMLElement
  copyElements: HTMLElement[]
  ctaLink: HTMLElement | null
}

export interface BuildHeroTimelineOptions {
  refs: HeroTimelineRefs
}

/**
 * Single scrubbable timeline for desktop scroll and mobile arrow drivers.
 * State configs live in hero-states.ts — copy swaps there, not here.
 */
export function buildHeroTimeline({ refs }: BuildHeroTimelineOptions): gsap.core.Timeline {
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

  const {
    photoWrap,
    brandenburgPhoto,
    brandenburgFields,
    kottbusserFields,
    gate,
    copyElements,
    ctaLink,
  } = refs

  // --- State 0 → 1: zoom out, Brandenburg fields enter ---
  tl.fromTo(
    photoWrap,
    { scale: 2.65, xPercent: -12, yPercent: -8 },
    { scale: 1, xPercent: 0, yPercent: 0, duration: 0.22 },
    0
  )

  tl.fromTo(
    brandenburgFields,
    { opacity: 0, scale: 1.06 },
    { opacity: 1, scale: 1, duration: 0.18, stagger: 0.04 },
    0.1
  )

  // --- State 1 → 2: photograph dissolves, Brandenburg fields retract ---
  // No Kottbusser photograph — the missing image is the point.
  tl.to(brandenburgPhoto, { opacity: 0, duration: 0.22 }, 0.3)

  tl.to(
    brandenburgFields,
    {
      opacity: 0,
      scale: 0.88,
      xPercent: 18,
      duration: 0.22,
      stagger: 0.02,
    },
    0.3
  )

  // --- State 2 → 3: Kottbusser fields arrive, gate slides in small and contained ---
  tl.fromTo(
    kottbusserFields,
    { opacity: 0, yPercent: 6 },
    { opacity: 1, yPercent: 0, duration: 0.18, stagger: 0.05 },
    0.5
  )

  tl.fromTo(
    gate,
    {
      opacity: 0,
      y: 28,
      width: HERO_GATE_SIZE.width,
      height: HERO_GATE_SIZE.height,
    },
    {
      opacity: 1,
      y: 0,
      width: HERO_GATE_SIZE.width,
      height: HERO_GATE_SIZE.height,
      duration: 0.16,
    },
    0.56
  )

  // --- States 3 → 4 → 5: box holds at final scale; CTA emerges in state 5 ---
  if (ctaLink) {
    tl.fromTo(ctaLink, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.1 }, 0.88)
  }

  // Copy cross-fades keyed to state progress points
  HERO_STATES.forEach((state, index) => {
    const el = copyElements[index]
    if (!el) return

    const fadeIn = state.progress
    const fadeOut =
      index < HERO_STATES.length - 1
        ? HERO_STATES[index + 1].progress - 0.04
        : HERO_TIMELINE_END

    tl.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.06 }, fadeIn)
    if (index < HERO_STATES.length - 1) {
      tl.to(el, { opacity: 0, y: -6, duration: 0.05 }, fadeOut)
    }
  })

  return tl
}
