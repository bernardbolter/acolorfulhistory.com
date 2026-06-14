'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useHistory } from '@/providers/HistoryProvider'
import { getUniqueCities } from '@/lib/mapArtwork'
import FilterDot from '@/components/Map/FilterDot'

export default function FilterSort() {
  const [history, setHistory] = useHistory()
  const t = useTranslations()
  const [expanded, setExpanded] = useState(false)

  const cities = useMemo(
    () => getUniqueCities(history.original),
    [history.original]
  )

  const toggleCity = (city: string) => {
    setHistory((state) => {
      const isChecked = state.checked.includes(city)
      const checked = isChecked
        ? state.checked.filter((c) => c !== city)
        : [...state.checked, city]

      return { ...state, checked }
    })
  }

  const setSorting = (sorting: 'latest' | 'oldest' | 'random') => {
    setHistory((state) => ({ ...state, sorting }))
  }

  return (
    <section
      className={`filter-sort-container ${expanded ? 'filter-sort-open' : ''}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <button
        type="button"
        className="filter-sort-tab"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
      >
        {t('filterAndSort')}
      </button>

      <div className="filter-sort-content">
        <div className="filter-sort-section">
          <p className="filter-sort-label">{t('filter')}</p>
          <ul className="filter-city-list">
            {cities.map((city) => {
              const checked = history.checked.includes(city)
              return (
                <li key={city}>
                  <button
                    type="button"
                    className="filter-city-row"
                    onClick={() => toggleCity(city)}
                  >
                    <FilterDot checked={checked} city={city} />
                    <span>{city}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="filter-sort-section">
          <p className="filter-sort-label">{t('sort')}</p>
          <div className="filter-sort-options">
            {(['latest', 'oldest', 'random'] as const).map((option) => (
              <button
                key={option}
                type="button"
                className={`filter-sort-option ${
                  history.sorting === option ? 'filter-sort-option-active' : ''
                }`}
                onClick={() => setSorting(option)}
              >
                {t(option)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
