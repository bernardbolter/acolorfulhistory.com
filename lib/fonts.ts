import { Barlow_Semi_Condensed, Josefin_Sans, Limelight } from 'next/font/google'

export const barlow = Barlow_Semi_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-barlow',
  display: 'swap',
})

export const limelight = Limelight({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-limelight',
  display: 'swap',
})

/** List card titles only — do not use for page/series Limelight contexts. */
export const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-josefin',
  display: 'swap',
})

export const bodyFontClassName = barlow.className
