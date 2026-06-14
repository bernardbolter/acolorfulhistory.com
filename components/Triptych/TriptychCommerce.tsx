'use client'

import { useState } from 'react'
import { addToCart, isVendureConfigured } from '@/lib/vendure'
import type { PrintSet } from '@/types/triptych'

interface TriptychCommerceProps {
  status?: string
  printSets?: PrintSet[]
  vendureProductId?: string
  signedAndNumbered?: boolean
  printEditionReleaseDate?: string
}

const STATUS_LABELS: Record<string, string> = {
  available: 'Original set available',
  sold: 'Original set sold',
  'prints-only': 'Prints only',
}

export default function TriptychCommerce({
  status,
  printSets = [],
  vendureProductId,
  signedAndNumbered,
  printEditionReleaseDate,
}: TriptychCommerceProps) {
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const handleAdd = async (set: PrintSet) => {
    const productId = set.vendureProductId || vendureProductId
    if (!productId) {
      setMessage('Product not configured yet.')
      return
    }

    setLoading(set.size)
    const result = await addToCart(productId)
    setLoading(null)
    setMessage(result.success ? 'Added to cart.' : result.error || 'Could not add to cart.')
  }

  return (
    <section className="triptych-commerce zone-dense" id="commerce">
      <p className="label-small-caps mb-4">Commerce</p>

      {status && (
        <p className="text-body text-text-dark mb-4">
          {STATUS_LABELS[status] || status}
        </p>
      )}

      <div className="triptych-print-sets space-y-4">
        {printSets.map((set) => (
          <div key={set.size} className="triptych-print-set">
            <p className="text-body font-bold capitalize">{set.size} print edition</p>
            <p className="text-body text-text-muted">
              Edition of {set.edition}
              {set.printAvailableCount != null
                ? ` · ${set.printAvailableCount} remaining`
                : ''}
            </p>
            <button
              type="button"
              className="triptych-add-to-cart"
              disabled={Boolean(loading) || set.printAvailableCount === 0}
              onClick={() => handleAdd(set)}
            >
              {loading === set.size ? 'Adding…' : 'Add to cart'}
            </button>
          </div>
        ))}
      </div>

      {signedAndNumbered && (
        <p className="mt-4 text-body text-text-muted">Signed and numbered.</p>
      )}

      {printEditionReleaseDate && (
        <p className="text-body text-text-muted">
          Print edition release: {printEditionReleaseDate}
        </p>
      )}

      {!isVendureConfigured() && (
        <p className="mt-4 text-body text-text-muted">
          Store checkout will be available when Vendure is configured.
        </p>
      )}

      {message && <p className="mt-3 text-body text-text-dark">{message}</p>}
    </section>
  )
}
