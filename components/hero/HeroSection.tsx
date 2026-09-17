'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroCanvas, { type HeroCanvasHandle } from '@/components/hero/HeroCanvas'
import HeroCopy, { type HeroCopyHandle } from '@/components/hero/HeroCopy'
import HeroMobileArrow from '@/components/hero/HeroMobileArrow'
import { HERO_MOBILE_STOPS } from '@/components/hero/hero-states'
import { buildHeroTimeline } from '@/components/hero/hero-timeline'
import type { HeroAssets } from '@/lib/heroAssets'

interface HeroSectionProps {
  assets: HeroAssets
}

export default function HeroSection({ assets }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HeroCanvasHandle>(null)
  const copyRef = useRef<HeroCopyHandle>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const mobileStopIndexRef = useRef(0)

  const [mobileStep, setMobileStep] = useState(0)
  const [mobileComplete, setMobileComplete] = useState(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const section = sectionRef.current
    const canvas = canvasRef.current
    const copy = copyRef.current
    if (!section || !canvas || !copy) return

    const { photoWrap, brandenburgPhoto, brandenburgFields, kottbusserFields, gate } =
      canvas.refs

    if (!photoWrap || !brandenburgPhoto || !gate || brandenburgFields.length === 0) {
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const timeline = buildHeroTimeline({
      refs: {
        section,
        photoWrap,
        brandenburgPhoto,
        brandenburgFields,
        kottbusserFields,
        gate,
        copyElements: copy.copyElements,
        ctaLink: copy.ctaLink,
      },
    })

    timelineRef.current = timeline
    timeline.pause()

    if (reducedMotion) {
      timeline.progress(1)
      return () => {
        timeline.kill()
      }
    }

    const mm = gsap.matchMedia()

    mm.add('(min-width: 769px)', () => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=450%',
        pin: true,
        scrub: 0.6,
        animation: timeline,
        anticipatePin: 1,
      })
      scrollTriggerRef.current = st

      return () => {
        st.kill()
        scrollTriggerRef.current = null
      }
    })

    mm.add('(max-width: 768px)', () => {
      mobileStopIndexRef.current = 0
      setMobileStep(0)
      setMobileComplete(false)
      timeline.progress(0)

      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=120%',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      })
      scrollTriggerRef.current = st

      return () => {
        st.kill()
        scrollTriggerRef.current = null
      }
    })

    return () => {
      mm.revert()
      timeline.kill()
      timelineRef.current = null
    }
  }, [assets.brandenburgUrl])

  const handleMobileAdvance = () => {
    const timeline = timelineRef.current
    if (!timeline || mobileComplete) return

    const nextIndex = mobileStopIndexRef.current + 1
    if (nextIndex >= HERO_MOBILE_STOPS.length) {
      setMobileComplete(true)
      return
    }

    const targetProgress = HERO_MOBILE_STOPS[nextIndex]
    mobileStopIndexRef.current = nextIndex
    setMobileStep(nextIndex)

    gsap.to(timeline, {
      progress: targetProgress,
      duration: 0.85,
      ease: 'power2.inOut',
      onComplete: () => {
        if (nextIndex >= HERO_MOBILE_STOPS.length - 1) {
          setMobileComplete(true)
        }
      },
    })
  }

  return (
    <section
      ref={sectionRef}
      className="hero-section relative h-[100dvh] w-full overflow-hidden"
      aria-label="Homepage hero animation"
    >
      <HeroCanvas
        ref={canvasRef}
        brandenburgUrl={assets.brandenburgUrl}
        brandenburgAlt={assets.brandenburgAlt}
      />
      <HeroCopy ref={copyRef} />
      <HeroMobileArrow
        onAdvance={handleMobileAdvance}
        disabled={mobileComplete}
        currentStep={mobileStep}
        totalSteps={HERO_MOBILE_STOPS.length - 1}
      />
    </section>
  )
}
