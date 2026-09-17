'use client'

import type { CSSProperties } from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from '@/i18n/routing'
import HeroFieldLayer from '@/components/Home/HeroFieldLayer'
import PaintingListMeta from '@/components/Home/PaintingListMeta'
import ListCard from '@/components/Home/ListCard'
import {
  buildHeroListTimeline,
  computePhotoCoverTransform,
  HERO_CHOREOGRAPHY,
  photoRectStyle,
} from '@/components/Home/hero-timeline'
import { FALLBACK_BLUR_DATA_URL } from '@/lib/placeholders'
import { resolveHeroAnimationPayload } from '@/lib/heroFields'
import {
  listImageOrientationClass,
  listImageStyleVars,
  resolveListAspectRatio,
} from '@/lib/listImageSizing'
import type { Artwork } from '@/types/artwork'

/** Square composition frame after the viewport pull-back (Phase B). */
const COMPOSITION_VH = 0.72

interface HeroListItemProps {
  artwork: Artwork
}

function titleCaseCity(city: string): string {
  return city
    .trim()
    .split(/\s+/)
    .map((word) =>
      word
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word
    )
    .join(' ')
}

/** Prefer historical source year, then year in title/slug, then paint year. */
function heroCaptionYear(artwork: Artwork): number | undefined {
  const fromSource = artwork.ach?.source?.approximateDateYear
  if (typeof fromSource === 'number' && fromSource > 0) return fromSource

  const fromTitle = artwork.title?.match(/\b(1[0-9]{3}|20[0-2][0-9])\b/)
  if (fromTitle) return Number(fromTitle[1])

  const fromSlug = artwork.slug?.match(/\b(1[0-9]{3}|20[0-2][0-9])\b/)
  if (fromSlug) return Number(fromSlug[1])

  const paintYear = artwork.yearCreated ?? artwork.artworkFields.year
  return paintYear && paintYear > 0 ? paintYear : undefined
}

function placeYearLabel(artwork: Artwork): string {
  const city = artwork.artworkFields.city
    ? titleCaseCity(artwork.artworkFields.city)
    : ''
  const year = heroCaptionYear(artwork)
  if (city && year) return `${city} . ${year}`
  return city || (year ? String(year) : '')
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function HeroListItem({ artwork }: HeroListItemProps) {
  const t = useTranslations()
  const hero = resolveHeroAnimationPayload(artwork)
  const paintingUrl =
    artwork.primaryImageUrl || artwork.artworkFields.artworkImage?.mediaItemUrl
  const canAnimate = Boolean(hero && paintingUrl)

  const itemRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const paintingRef = useRef<HTMLDivElement>(null)
  const captionPlaceRef = useRef<HTMLParagraphElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const fieldRefs = useRef<(HTMLElement | null)[]>([])
  const listAnchorRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const playTweenRef = useRef<gsap.core.Tween | null>(null)

  const [skipAnimation, setSkipAnimation] = useState(!canAnimate)
  const [ready, setReady] = useState(false)
  const [showPlay, setShowPlay] = useState(true)
  /** Near end of scrub — metadata / link; ScrollTrigger stays alive for reverse. */
  const [atEnd, setAtEnd] = useState(false)

  const aspectRatio = resolveListAspectRatio(artwork.aspectRatio)
  const imageStyleVars = listImageStyleVars(artwork)
  const orientationClass = listImageOrientationClass(
    artwork.artworkFields.orientation
  )
  const blurDataURL = artwork.placeholderBlurDataURL ?? FALLBACK_BLUR_DATA_URL
  const placeYear = placeYearLabel(artwork)
  const photoUrl = hero?.photoUrl
  const useGrayscaleFallback = Boolean(hero && !photoUrl)

  const killPlayTween = useCallback(() => {
    playTweenRef.current?.kill()
    playTweenRef.current = null
  }, [])

  useLayoutEffect(() => {
    if (!canAnimate || !hero) return
    const photo = photoRef.current
    if (!photo) return

    const cover = computePhotoCoverTransform(
      hero.fields.photoRect,
      window.innerWidth,
      window.innerHeight
    )
    gsap.set(photo, {
      x: cover.x,
      y: cover.y,
      scale: cover.scale,
      rotation: cover.rotation,
      transformOrigin: '50% 50%',
    })
  }, [canAnimate, hero])

  /** Drive the scrub via scroll so reverse scroll stays in sync. */
  const handlePlay = useCallback(() => {
    const st = scrollTriggerRef.current
    const tl = timelineRef.current
    if (!st || !tl) return

    killPlayTween()
    setShowPlay(false)

    const remaining = 1 - st.progress
    if (remaining <= 0.001) {
      setAtEnd(true)
      return
    }

    const proxy = { y: window.scrollY }
    playTweenRef.current = gsap.to(proxy, {
      y: st.end,
      duration: Math.max(0.5, remaining * tl.duration()),
      ease: 'none',
      onUpdate: () => {
        window.scrollTo(0, proxy.y)
      },
      onComplete: () => {
        playTweenRef.current = null
        setAtEnd(true)
      },
    })
  }, [killPlayTween])

  useEffect(() => {
    if (!canAnimate || !hero || !paintingUrl) {
      setSkipAnimation(true)
      return
    }

    if (prefersReducedMotion()) {
      setSkipAnimation(true)
      setAtEnd(true)
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    const item = itemRef.current
    const stage = stageRef.current
    const photo = photoRef.current
    const painting = paintingRef.current
    const captionPlace = captionPlaceRef.current
    const meta = metaRef.current
    if (
      !item ||
      !stage ||
      !photo ||
      !painting ||
      !captionPlace ||
      !meta
    ) {
      return
    }

    let cancelled = false

    const setup = async () => {
      const photoImg = photo.querySelector('img')
      const paintingImg = painting.querySelector('img')
      try {
        if (photoImg?.decode) await photoImg.decode()
        else if (paintingImg?.decode) await paintingImg.decode()
      } catch {
        // decode can reject on cached/broken images — still attempt setup
      }
      if (cancelled) return

      const listWidth =
        listAnchorRef.current?.firstElementChild instanceof HTMLElement
          ? listAnchorRef.current.firstElementChild.offsetWidth
          : listAnchorRef.current?.offsetWidth || stage.offsetWidth
      const settleSizePx = listWidth > 0 ? listWidth : stage.offsetWidth
      const compositionSizePx = Math.min(
        window.innerWidth * 0.92,
        window.innerHeight * COMPOSITION_VH
      )

      const fields = fieldRefs.current.filter(
        (node): node is HTMLElement => Boolean(node)
      )

      gsap.set(stage, {
        width: window.innerWidth,
        height: window.innerHeight,
      })

      const tl = buildHeroListTimeline({
        refs: {
          stage,
          photo,
          fields,
          painting,
          captionPlace,
          meta,
        },
        photoRect: hero.fields.photoRect,
        fieldCount: fields.length,
        compositionSizePx,
        settleSizePx,
      })

      timelineRef.current = tl

      const st = ScrollTrigger.create({
        trigger: item,
        start: 'top top',
        end: HERO_CHOREOGRAPHY.scrollScrubEnd,
        pin: true,
        pinSpacing: true,
        scrub: HERO_CHOREOGRAPHY.scrollScrubSmoothing,
        animation: tl,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setShowPlay(self.progress < 0.012)
          setAtEnd(self.progress > 0.985)
        },
        onLeaveBack: () => {
          setShowPlay(true)
          setAtEnd(false)
        },
      })

      scrollTriggerRef.current = st
      setReady(true)
      ScrollTrigger.refresh()
    }

    const onUserScrollInterrupt = () => {
      // Let the visitor take over from the play tween; scrub keeps working.
      if (playTweenRef.current) killPlayTween()
    }

    window.addEventListener('wheel', onUserScrollInterrupt, { passive: true })
    window.addEventListener('touchstart', onUserScrollInterrupt, { passive: true })

    void setup()

    return () => {
      cancelled = true
      killPlayTween()
      window.removeEventListener('wheel', onUserScrollInterrupt)
      window.removeEventListener('touchstart', onUserScrollInterrupt)
      scrollTriggerRef.current?.kill()
      scrollTriggerRef.current = null
      timelineRef.current?.kill()
      timelineRef.current = null
    }
  }, [canAnimate, artwork.slug, hero?.fields.fields.length, paintingUrl, killPlayTween])

  if (skipAnimation || !hero || !paintingUrl) {
    return <ListCard artwork={artwork} isHeroSlot priority />
  }

  return (
    <article
      ref={itemRef}
      className={`painting-list-item hero-list-item is-performing${
        atEnd ? ' is-at-end' : ''
      }${ready ? ' is-ready' : ''}`}
      data-hero-slot="true"
    >
      <div
        ref={listAnchorRef}
        className={`hero-list-size-anchor painting-list-card ${orientationClass}`}
        style={imageStyleVars as CSSProperties}
        aria-hidden
      >
        <div
          className="painting-list-image"
          style={{ ...imageStyleVars, aspectRatio: `${aspectRatio} / 1` }}
        />
      </div>

      <div className="hero-list-pin">
        <Link
          href={`/${artwork.slug}`}
          className={`hero-list-link ${orientationClass}${
            atEnd ? '' : ' hero-list-link--inactive'
          }`}
          style={imageStyleVars as CSSProperties}
          tabIndex={atEnd ? undefined : -1}
          aria-hidden={atEnd ? undefined : true}
        >
          <div
            ref={stageRef}
            className={`hero-list-stage${atEnd ? ' is-at-end' : ''}`}
          >
            <div className="hero-list-media-clip">
              <div
                ref={photoRef}
                className={`hero-list-photo${
                  useGrayscaleFallback ? ' hero-list-photo--grayscale' : ''
                }`}
                style={photoRectStyle(hero.fields.photoRect)}
              >
                <Image
                  src={photoUrl || paintingUrl}
                  alt={hero.photoAlt || artwork.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                  unoptimized={Boolean(photoUrl?.startsWith('/'))}
                />
              </div>
            </div>

            <HeroFieldLayer
              className="hero-list-fields"
              fields={hero.fields.fields}
              fieldRefs={fieldRefs}
            />

            <div ref={paintingRef} className="hero-list-painting">
              <Image
                src={paintingUrl}
                alt={artwork.title}
                fill
                className="object-cover"
                sizes="100vw"
                placeholder="blur"
                blurDataURL={blurDataURL}
                priority
              />
            </div>

            <div className="hero-list-captions" aria-live="polite">
              <p ref={captionPlaceRef} className="hero-list-caption">
                {placeYear}
              </p>
            </div>
          </div>

          <div ref={metaRef} className="hero-list-meta painting-list-copy">
            <h2 className="painting-list-title">{artwork.title}</h2>
            <PaintingListMeta artwork={artwork} />
          </div>
        </Link>

        {showPlay && !atEnd && ready && (
          <button
            type="button"
            className="hero-list-play"
            onClick={handlePlay}
            aria-label={t('heroPlayLabel')}
          >
            <span className="hero-list-play-icon-wrap" aria-hidden>
              <svg
                className="hero-list-play-icon"
                viewBox="0 0 24 24"
                width="28"
                height="28"
              >
                <path d="M8 5v14l12-7z" fill="currentColor" />
              </svg>
            </span>
            <span className="hero-list-play-hint">{t('heroOrScroll')}</span>
          </button>
        )}
      </div>
    </article>
  )
}
