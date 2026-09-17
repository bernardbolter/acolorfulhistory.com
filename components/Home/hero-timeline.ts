import gsap from 'gsap'
import type { HeroFieldsData, HeroPhotoRect } from '@/types/hero'

/** Tunable once — applies to every painting in the hero-eligible pool (brief-13 §5). */
export const HERO_CHOREOGRAPHY = {
  /** Fallback only — prefer computePhotoCoverTransform() from photoRect (brief-13 §7). */
  photoZoomScale: 3.0,
  photoDwellMs: 0,
  /** Stage shrinks from viewport → square composition during Phase B. */
  photoZoomOutMs: 1600,
  photoZoomOutEase: 'power2.out',

  fieldEntryRadiusMin: 1.5,
  fieldEntryRadiusMax: 3.5,
/** How far past the canvas edge fields start (× full stage size, in px). */
  fieldCornerOvershoot: 1.15,
  /** Start rotation for field fly-in — tweens to 0 (half-turn spin while landing). */
  fieldEntryRotationDeg: 180,
  fieldEntryScale: 0.7,
  /** Kept in sync with photoZoomOut — fields land with the photo. */
  fieldLandDurationMs: 1600,
  fieldLandEase: 'power2.out',
  fieldStaggerMs: 0,

  resolveDelayAfterLastFieldMs: 250,
  resolveDurationMs: 700,

  settleDelayAfterResolveMs: 950,
  settleDurationMs: 800,
  settleEase: 'power2.out',

  captionFadeMs: 300,

  /** Scroll distance mapped to the full timeline when scrubbing. */
  scrollScrubEnd: '+=450%',
  scrollScrubSmoothing: 0.65,
} as const

/**
 * Live tuning for where the photo sits at rest (end of Phase B).
 * Reset after photoRect re-fit — adjust only if the compositor rect still needs a nudge.
 */
export const PHOTO_REST_TUNE = {
  /** 1 = photoRect size as fitted; 1.1 = 10% larger, etc. */
  scale: 1,
  /** Rest nudge in px (applied via GSAP on the photo wrapper). */
  offsetXPx: 0,
  offsetYPx: 0,
} as const

export function photoRestRotation(photoRect: HeroPhotoRect): number {
  return photoRect.rot ?? 0
}

export function photoRestTransform(photoRect: HeroPhotoRect): {
  x: number
  y: number
  scale: number
  rotation: number
} {
  return {
    x: PHOTO_REST_TUNE.offsetXPx,
    y: PHOTO_REST_TUNE.offsetYPx,
    scale: 1,
    rotation: photoRestRotation(photoRect),
  }
}

export interface HeroTimelineRefs {
  stage: HTMLElement
  photo: HTMLElement
  fields: Element[]
  painting: HTMLElement
  captionPlace: HTMLElement
  meta: HTMLElement
}

export interface BuildHeroListTimelineOptions {
  refs: HeroTimelineRefs
  photoRect: HeroPhotoRect
  fieldCount: number
  /** Square edge after Phase B pull-back (composition frame). */
  compositionSizePx: number
  /** Target list-item edge length in px (square). */
  settleSizePx: number
  onComplete?: () => void
}

function ms(value: number): number {
  return value / 1000
}

/** Shuffle corners each load; fields arrive from viewport corners, not random arcs. */
const VIEWPORT_CORNERS = [
  { x: -1, y: -1 }, // top-left
  { x: 1, y: -1 }, // top-right
  { x: -1, y: 1 }, // bottom-left
  { x: 1, y: 1 }, // bottom-right
] as const

function shuffledCorners(): Array<{ x: number; y: number }> {
  const corners = [...VIEWPORT_CORNERS]
  for (let i = corners.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[corners[i], corners[j]] = [corners[j], corners[i]]
  }
  return corners
}

/** Fresh per page load — each field starts fully past a viewport corner (CSS px). */
export function computeFieldEntryTransforms(
  fieldCount: number,
  canvasWidth: number,
  canvasHeight: number
): Array<{ x: number; y: number; rotation: number; scale: number }> {
  const { fieldCornerOvershoot, fieldEntryRotationDeg, fieldEntryScale } =
    HERO_CHOREOGRAPHY
  // Full stage size — wrappers are stage-sized, so half-width still leaves large
  // polygons (sky, etc.) partially on-screen. Full width/height clears the canvas.
  const corners = shuffledCorners()

  return Array.from({ length: fieldCount }, (_, index) => {
    const corner = corners[index % corners.length]
    const jitter = 0.95 + Math.random() * 0.12
    // Alternate CW / CCW half-turns so neighboring fields don’t all spin the same way.
    const spin = index % 2 === 0 ? fieldEntryRotationDeg : -fieldEntryRotationDeg
    return {
      x: corner.x * canvasWidth * fieldCornerOvershoot * jitter,
      y: corner.y * canvasHeight * fieldCornerOvershoot * jitter,
      rotation: spin,
      scale: fieldEntryScale,
    }
  })
}

export function photoRectOrigin(photoRect: HeroPhotoRect): string {
  return `${(photoRect.x + photoRect.w / 2) * 100}% ${
    (photoRect.y + photoRect.h / 2) * 100
  }%`
}

/**
 * Phase A: photo fills the canvas (cover), upright — no rotation.
 * Phase B settles into photoRect with photoRect.rot (brief-13 §7).
 */
export function computePhotoCoverTransform(
  photoRect: HeroPhotoRect,
  containerWidth: number,
  containerHeight: number
): { x: number; y: number; scale: number; rotation: number } {
  const tuned = tunedPhotoRect(photoRect)
  const w = tuned.w
  const h = tuned.h
  // Cover: fill the frame (crop edges if needed), not contain.
  const scale =
    w > 0 && h > 0
      ? Math.max(1 / w, 1 / h)
      : HERO_CHOREOGRAPHY.photoZoomScale

  const centerX = (tuned.x + w / 2) * containerWidth
  const centerY = (tuned.y + h / 2) * containerHeight

  return {
    scale,
    x: containerWidth / 2 - centerX,
    y: containerHeight / 2 - centerY,
    rotation: 0,
  }
}

/** photoRect with PHOTO_REST_TUNE scale applied (centered shrink). */
export function tunedPhotoRect(photoRect: HeroPhotoRect): HeroPhotoRect {
  const { scale } = PHOTO_REST_TUNE
  const w = photoRect.w * scale
  const h = photoRect.h * scale
  return {
    x: photoRect.x + photoRect.w / 2 - w / 2,
    y: photoRect.y + photoRect.h / 2 - h / 2,
    w,
    h,
    rot: photoRect.rot,
  }
}

/** Inline layout for the photo wrapper — rest position = tuned photoRect. */
export function photoRectStyle(photoRect: HeroPhotoRect): {
  left: string
  top: string
  width: string
  height: string
} {
  const tuned = tunedPhotoRect(photoRect)
  return {
    left: `${tuned.x * 100}%`,
    top: `${tuned.y * 100}%`,
    width: `${tuned.w * 100}%`,
    height: `${tuned.h * 100}%`,
  }
}

/**
 * Single autoplay timeline — phases A–D from brief-13.
 * Photo rests at photoRect; Phase A is a cover transform on that wrapper.
 * Phase B pulls the transform to identity while the stage shrinks to square.
 */
export function buildHeroListTimeline({
  refs,
  photoRect,
  fieldCount,
  compositionSizePx,
  settleSizePx,
  onComplete,
}: BuildHeroListTimelineOptions): gsap.core.Timeline {
  const {
    stage,
    photo,
    fields,
    painting,
    captionPlace,
    meta,
  } = refs

  const c = HERO_CHOREOGRAPHY
  const rect = stage.getBoundingClientRect()
  const stageW = rect.width || stage.offsetWidth || 1
  const stageH = rect.height || stage.offsetHeight || 1
  const entries = computeFieldEntryTransforms(fieldCount, stageW, stageH)
  const cover = computePhotoCoverTransform(photoRect, stageW, stageH)

  // Photo rests at photoRect via CSS; Phase A starts zoomed to cover the frame.
  gsap.set(photo, {
    x: cover.x,
    y: cover.y,
    scale: cover.scale,
    rotation: cover.rotation,
    transformOrigin: '50% 50%',
    opacity: 1,
  })
  gsap.set(painting, { opacity: 0 })
  gsap.set(meta, { opacity: 0 })
  gsap.set(captionPlace, { opacity: 1 })

  fields.forEach((el, index) => {
    const entry = entries[index] ?? {
      x: 0,
      y: 0,
      rotation: 0,
      scale: c.fieldEntryScale,
    }
    gsap.set(el, {
      x: entry.x,
      y: entry.y,
      rotation: entry.rotation,
      scale: entry.scale,
      opacity: 1,
      transformOrigin: '50% 50%',
    })
  })

  const tl = gsap.timeline({
    defaults: { ease: 'power2.out' },
    paused: true,
    onComplete,
  })

  const phaseBStart = 0
  const phaseBDuration = ms(c.photoZoomOutMs)

  // Stage: viewport → composition square
  tl.to(
    stage,
    {
      width: compositionSizePx,
      height: compositionSizePx,
      duration: phaseBDuration,
      ease: c.photoZoomOutEase,
    },
    phaseBStart
  )

  // Photo: cover zoom → rest at photoRect + px nudge (rotation held at photoRect.rot)
  const rest = photoRestTransform(photoRect)
  tl.to(
    photo,
    {
      x: rest.x,
      y: rest.y,
      scale: rest.scale,
      rotation: rest.rotation,
      duration: phaseBDuration,
      ease: c.photoZoomOutEase,
    },
    phaseBStart
  )

  tl.to(captionPlace, { opacity: 0, duration: ms(c.captionFadeMs) }, phaseBStart)

  fields.forEach((el) => {
    tl.to(
      el,
      {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: phaseBDuration,
        ease: c.photoZoomOutEase,
      },
      phaseBStart
    )
  })

  const phaseBEnd = phaseBStart + phaseBDuration

  // --- Phase C: resolve to archive painting ---
  const phaseCStart = phaseBEnd + ms(c.resolveDelayAfterLastFieldMs)
  const resolveDur = ms(c.resolveDurationMs)

  tl.to(painting, { opacity: 1, duration: resolveDur, ease: 'power2.inOut' }, phaseCStart)
  tl.to(photo, { opacity: 0, duration: resolveDur, ease: 'power2.inOut' }, phaseCStart)
  tl.to(fields, { opacity: 0, duration: resolveDur, ease: 'power2.inOut' }, phaseCStart)

  // --- Phase D: settle into list size ---
  const phaseDStart = phaseCStart + ms(c.settleDelayAfterResolveMs)
  tl.to(
    stage,
    {
      width: settleSizePx,
      height: settleSizePx,
      duration: ms(c.settleDurationMs),
      ease: c.settleEase,
    },
    phaseDStart
  )
  tl.to(
    meta,
    {
      opacity: 1,
      duration: ms(c.settleDurationMs) * 0.7,
      ease: 'power2.out',
    },
    phaseDStart + ms(c.settleDurationMs) * 0.25
  )

  return tl
}

/** Jump instantly to the settled end state (scroll interrupt / reduced motion). */
export function jumpHeroTimelineToSettled(tl: gsap.core.Timeline): void {
  tl.progress(1, false)
}

export function phaseBWindow(_fieldCount: number): { start: number; end: number } {
  return { start: 0, end: ms(HERO_CHOREOGRAPHY.photoZoomOutMs) }
}

export type { HeroFieldsData }
