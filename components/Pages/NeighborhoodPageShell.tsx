import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import TitleOrnament from '@/components/UI/TitleOrnament'
import NeighborhoodInquiryForm from '@/components/Neighborhood/InquiryForm'
import type { NeighborhoodPage } from '@/types/neighborhoodPage'

interface NeighborhoodPageShellProps {
  page: NeighborhoodPage
}

function HtmlBlock({ html, className }: { html: string; className?: string }) {
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(html)
  if (looksLikeHtml) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
  return <p className={className}>{html}</p>
}

export default async function NeighborhoodPageShell({
  page,
}: NeighborhoodPageShellProps) {
  const t = await getTranslations()

  return (
    <main className="neighborhood-page min-h-screen bg-surface-page px-6 pt-28 pb-24 l:px-12">
      <header className="neighborhood-hero max-w-3xl">
        <TitleOrnament className="mb-4" />
        {page.kicker && (
          <p className="label-small-caps mb-3 text-text-muted">{page.kicker}</p>
        )}
        <h1 className="font-display text-artwork-title text-text-primary">
          {page.title}
        </h1>
        <HtmlBlock
          html={page.introduction}
          className="mt-8 max-w-2xl text-body text-text-dark"
        />
      </header>

      <section className="neighborhood-pitch mt-14 max-w-2xl">
        <div className="fault-line mb-8 max-w-md" aria-hidden>
          <span className="fault-line-heavy" />
          <span className="fault-line-light" />
        </div>
        <HtmlBlock
          html={page.pitch}
          className="text-body text-text-dark"
        />
        <HtmlBlock
          html={page.credibility}
          className="mt-6 text-body text-text-muted"
        />
      </section>

      <section className="neighborhood-tiers mt-20" aria-labelledby="tiers-heading">
        <p className="label-small-caps mb-2 text-text-muted">
          {t('neighborhoodHowItWorks')}
        </p>
        <h2
          id="tiers-heading"
          className="font-display text-display-sm text-text-primary"
        >
          {t('neighborhoodThreeTiers')}
        </h2>

        <ol className="mt-10 space-y-16">
          {page.tiers.map((tier, index) => (
            <li key={tier.id} id={`tier-${tier.id}`} className="max-w-3xl">
              <p className="label-small-caps text-text-muted">
                {t('neighborhoodTierLabel', { n: index + 1 })}
              </p>
              <h3 className="mt-2 font-display text-display-sm text-text-primary">
                {tier.title}
              </h3>
              <HtmlBlock
                html={tier.body}
                className="mt-4 max-w-2xl text-body text-text-dark"
              />

              {tier.images.length > 0 && (
                <ul className="neighborhood-source-grid mt-8">
                  {tier.images.map((image) => (
                    <li key={image.id} className="neighborhood-source-card">
                      {image.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image.imageUrl}
                          alt={image.title}
                          className="neighborhood-source-image"
                        />
                      ) : (
                        <div
                          className="neighborhood-source-placeholder"
                          aria-hidden
                        />
                      )}
                      <div className="mt-3">
                        <p className="text-artwork-meta font-medium text-text-primary">
                          {image.title}
                        </p>
                        {(image.neighborhood || image.yearLabel) && (
                          <p className="text-artwork-meta text-text-muted">
                            {[image.neighborhood, image.yearLabel]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        )}
                        {image.caption && (
                          <p className="mt-2 text-artwork-meta text-text-dark">
                            {image.caption}
                          </p>
                        )}
                        {image.proofUrl && (
                          <a
                            href={image.proofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="home-cta mt-2 inline-block text-artwork-meta"
                          >
                            → {image.proofLabel || t('neighborhoodProofLink')}
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {tier.id === 'browse' && tier.images.length === 0 && (
                <p className="mt-6 text-artwork-meta text-text-muted">
                  {t('neighborhoodBrowseEmpty')}
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section
        className="neighborhood-pricing mt-20 max-w-2xl"
        aria-labelledby="pricing-heading"
      >
        <div className="fault-line mb-8 max-w-md" aria-hidden>
          <span className="fault-line-heavy" />
          <span className="fault-line-light" />
        </div>
        <p className="label-small-caps text-text-muted">{t('neighborhoodPricing')}</p>
        <h2
          id="pricing-heading"
          className="mt-2 font-display text-display-sm text-text-primary"
        >
          {page.pricing.headline}
        </h2>
        <HtmlBlock
          html={page.pricing.body}
          className="mt-4 text-body text-text-dark"
        />
        <dl className="neighborhood-price-row mt-8">
          <div>
            <dt className="label-small-caps text-text-muted">{t('neighborhoodSize')}</dt>
            <dd className="mt-1 text-body text-text-primary">{page.pricing.sizeLabel}</dd>
          </div>
          <div>
            <dt className="label-small-caps text-text-muted">{t('neighborhoodPrice')}</dt>
            <dd className="mt-1 font-display text-display-sm text-text-primary">
              {page.pricing.priceLabel}
            </dd>
          </div>
          <div>
            <dt className="label-small-caps text-text-muted">{t('neighborhoodBatch')}</dt>
            <dd className="mt-1 text-body text-text-primary">{page.pricing.batchLabel}</dd>
          </div>
        </dl>
        {page.pricing.note && (
          <p className="mt-6 text-artwork-meta text-text-muted">{page.pricing.note}</p>
        )}
      </section>

      <section
        className="neighborhood-inquiry-section mt-20 max-w-2xl"
        aria-labelledby="inquiry-heading"
        id="inquire"
      >
        <p className="label-small-caps text-text-muted">{t('neighborhoodInquire')}</p>
        <h2
          id="inquiry-heading"
          className="mt-2 font-display text-display-sm text-text-primary"
        >
          {page.ctaLabel}
        </h2>
        <p className="mt-4 text-body text-text-dark">
          {t('neighborhoodInquireIntro')}
        </p>
        <div className="mt-8">
          <NeighborhoodInquiryForm
            inquiryEmail={page.inquiryEmail}
            ctaLabel={page.ctaLabel}
            labels={{
              name: t('neighborhoodFormName'),
              email: t('neighborhoodFormEmail'),
              neighborhood: t('neighborhoodFormNeighborhood'),
              tier: t('neighborhoodFormTier'),
              tierBrowse: t('neighborhoodFormTierBrowse'),
              tierRevisited: t('neighborhoodFormTierRevisited'),
              tierResearch: t('neighborhoodFormTierResearch'),
              roomNotes: t('neighborhoodFormRoomNotes'),
              message: t('neighborhoodFormMessage'),
              submit: t('neighborhoodFormSubmit'),
              mailtoHint: t('neighborhoodFormMailtoHint'),
              noEmailHint: t('neighborhoodFormNoEmailHint'),
            }}
          />
        </div>
      </section>

      <div className="mt-16 flex flex-wrap gap-6">
        <Link href="/" className="home-cta">
          → {t('exploreCollection')}
        </Link>
        <Link href="/series/mediums-of-perception" className="home-cta">
          → {t('mediumsOfPerception')}
        </Link>
      </div>
    </main>
  )
}
