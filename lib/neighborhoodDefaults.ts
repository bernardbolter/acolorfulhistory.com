import type { NeighborhoodPage } from '@/types/neighborhoodPage'

/**
 * Static fallback until Payload global `neighborhood-page` is seeded.
 * Copy direction from docs/SFpainting/ach-neighborhood-commissions-page-brief.md
 * (naming locked Aug 25 2026: nav "Neighborhood Commissions", URL /neighborhood).
 */
export function getNeighborhoodPageDefaults(
  locale: 'en' | 'de' = 'en'
): NeighborhoodPage {
  if (locale === 'de') {
    return {
      ...EN_DEFAULTS,
      title: 'Neighborhood Commissions',
      kicker: 'A Colorful History — San Francisco',
      introduction:
        'Ein gebürtiger San Franciscaner, der in Berlin lebt, kehrt regelmäßig nach SF zurück, um individuelle Auftragsarbeiten zu malen — verwurzelt in der Nachbarschaftsgeschichte der Auftraggeberin oder des Auftraggebers.',
      pitch:
        'Ich lebe in Berlin, wo ich experimentellere, zukunftsweisendere Arbeit mache. San Francisco ist Zuhause — so bleibe ich damit verbunden. Kein Nachmalen, keine Wiederholungen: jede Commission ist vollständig individuell.',
      credibility:
        'Das ist keine neue Praxis, die um Vertrauen bittet — es ist eine über dreißigjährige Arbeit, die endlich sichtbar wird. Das Archiv, das jetzt online geht, ist der Beleg: eine dauerhafte, strukturierte Dokumentation der Praxis.',
      ctaLabel: 'Interesse bekunden',
      fromCms: false,
    }
  }

  return { ...EN_DEFAULTS }
}

const EN_DEFAULTS: NeighborhoodPage = {
  title: 'Neighborhood Commissions',
  kicker: 'A Colorful History — San Francisco',
  introduction:
    'A native San Franciscan, based in Berlin, returns to SF regularly to paint custom, one-of-a-kind commissions rooted in a client’s own neighborhood history — painted in the family shed studio (2559 27th Ave, Sunset District), delivered personally by hand, and permanently documented in Artism, the ongoing artist archive.',
  pitch:
    'I live in Berlin, where I make more experimental, cutting-edge work. San Francisco is home — this is how I stay connected to it. No repainting, no repeats — every commission is fully custom.',
  credibility:
    'This isn’t a new artist asking for trust — it’s a long practice finally showing its work. The archive coming online at the same moment this offering launches is the evidence: a 30+ year practice that has built a permanent, structured, machine-readable record of itself.',
  tiers: [
    {
      id: 'browse',
      title: 'Browse unpainted historical photos',
      body: 'A curated set of sourced-but-not-yet-painted San Francisco neighborhood images. Pick one you already care about — you pre-approve the source material, which speeds up and de-risks the commission for both sides.',
      images: [],
    },
    {
      id: 'revisited',
      title: 'Revisited subjects',
      body: 'A few historical photographs I painted years ago — I’ve returned to them now with three more decades of practice. Each new painting is entirely its own work, not a repeat, but a chance to do more justice to a subject I still think about. The photo has history; the painting doesn’t.',
      images: [
        {
          id: 'designer-commission',
          title: 'Designer commission',
          caption:
            'One of these was commissioned for a client’s home through a San Francisco interior designer.',
        },
        {
          id: 'artspan-selections-2017',
          title: 'ArtSpan Selections 2017',
          caption:
            'A revisited-subject painting selected for ArtSpan Selections 2017 — juried exhibition, part of ArtSpan’s Annual Art Bridge Gala at Heron Arts — and recently resold at auction. Juried recognition and market validation in one work.',
          proofUrl:
            'https://bernardbolter.com/events/artspan-selections-2017-heron-arts',
          proofLabel: 'Event record on bernardbolter.com',
        },
      ],
    },
    {
      id: 'research',
      title: 'Fully custom research',
      body: 'For a neighborhood not yet represented, I research and source the right historical photo — general internet research plus contacts in the San Francisco photo-archive world. The deepest, most bespoke tier.',
      images: [],
    },
  ],
  pricing: {
    headline: 'Founding collectors',
    body: 'First five commissions of the series, priced to start it — intentional launch pricing, not the ongoing rate.',
    sizeLabel: '36″ × 36″',
    priceLabel: '$1,800',
    batchLabel: '5 commissions',
    note: 'Direct / newsletter price. Designer- and agent-referred commissions are held separately.',
  },
  inquiryEmail: process.env.NEIGHBORHOOD_INQUIRY_EMAIL || undefined,
  ctaLabel: 'Start a conversation',
  fromCms: false,
}
