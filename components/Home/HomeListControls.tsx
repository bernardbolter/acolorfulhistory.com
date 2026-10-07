'use client'

import { useMemo, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import type { HomepageFacets, HomepageFilters, HomepageSort } from '@/lib/homepageArtworks'
import type { UnifiedAvailability } from '@/lib/unifiedAvailability'

interface HomeListControlsProps {
  facets: HomepageFacets
  filters: HomepageFilters
}

function decadeLabel(decadeStart: string): string {
  const start = Number.parseInt(decadeStart, 10)
  if (Number.isNaN(start)) return decadeStart
  return `${start}s`
}

function availabilityLabelKey(value: UnifiedAvailability): string {
  switch (value) {
    case 'available':
      return 'availabilityAvailable'
    case 'sold':
      return 'availabilitySold'
    case 'not-for-sale':
      return 'availabilityNotForSale'
    case 'on-loan':
      return 'availabilityOnLoan'
    case 'prints-only':
      return 'availabilityPrintsOnly'
  }
}

export default function HomeListControls({ facets, filters }: HomeListControlsProps) {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const activeSort: HomepageSort = filters.sort ?? 'random'

  const pushFilters = (next: HomepageFilters) => {
    const params = new URLSearchParams()

    if (next.sort && next.sort !== 'random') {
      params.set('sort', next.sort)
    }
    if (next.series) params.set('series', next.series)
    if (next.city) params.set('city', next.city)
    if (next.decade) params.set('decade', next.decade)
    if (next.availability) params.set('availability', next.availability)

    const query = params.toString()
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname)
    })
  }

  const sortOptions = useMemo(
    () =>
      [
        { value: 'random' as const, label: t('random') },
        { value: 'recent' as const, label: t('sortMostRecent') },
        { value: 'chronological' as const, label: t('sortChronological') },
      ],
    [t]
  )

  return (
    <section
      className={`home-list-controls ${isPending ? 'home-list-controls--pending' : ''}`}
      aria-label={t('filterAndSort')}
    >
      <div className="home-list-controls-row">
        <label className="home-list-control">
          <span className="home-list-control-label">{t('sort')}</span>
          <select
            className="home-list-control-select"
            value={activeSort}
            onChange={(event) =>
              pushFilters({
                ...filters,
                sort: event.target.value as HomepageSort,
              })
            }
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="home-list-control">
          <span className="home-list-control-label">{t('series')}</span>
          <select
            className="home-list-control-select"
            value={filters.series ?? ''}
            onChange={(event) =>
              pushFilters({
                ...filters,
                series: event.target.value || undefined,
              })
            }
          >
            <option value="">{t('filterAll')}</option>
            {facets.series.map((series) => (
              <option key={series.slug} value={series.slug}>
                {series.name}
              </option>
            ))}
          </select>
        </label>

        <label className="home-list-control">
          <span className="home-list-control-label">{t('filterCity')}</span>
          <select
            className="home-list-control-select"
            value={filters.city ?? ''}
            onChange={(event) =>
              pushFilters({
                ...filters,
                city: event.target.value || undefined,
              })
            }
          >
            <option value="">{t('filterAll')}</option>
            {facets.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>

        <label className="home-list-control">
          <span className="home-list-control-label">{t('filterDecade')}</span>
          <select
            className="home-list-control-select"
            value={filters.decade ?? ''}
            onChange={(event) =>
              pushFilters({
                ...filters,
                decade: event.target.value || undefined,
              })
            }
          >
            <option value="">{t('filterAll')}</option>
            {facets.decades.map((decade) => (
              <option key={decade} value={decade}>
                {decadeLabel(decade)}
              </option>
            ))}
          </select>
        </label>

        <label className="home-list-control">
          <span className="home-list-control-label">{t('filterAvailability')}</span>
          <select
            className="home-list-control-select"
            value={filters.availability ?? ''}
            onChange={(event) =>
              pushFilters({
                ...filters,
                availability: (event.target.value as UnifiedAvailability) || undefined,
              })
            }
          >
            <option value="">{t('filterAll')}</option>
            {facets.availability.map((value) => (
              <option key={value} value={value}>
                {t(availabilityLabelKey(value))}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  )
}
