'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { NeighborhoodTierId } from '@/types/neighborhoodPage'

export interface NeighborhoodInquiryFormProps {
  inquiryEmail?: string
  ctaLabel: string
  labels: {
    name: string
    email: string
    neighborhood: string
    tier: string
    tierBrowse: string
    tierRevisited: string
    tierResearch: string
    roomNotes: string
    message: string
    submit: string
    mailtoHint: string
    noEmailHint: string
  }
}

type FormState = {
  name: string
  email: string
  neighborhood: string
  tier: NeighborhoodTierId | ''
  roomNotes: string
  message: string
}

const INITIAL: FormState = {
  name: '',
  email: '',
  neighborhood: '',
  tier: '',
  roomNotes: '',
  message: '',
}

function buildBriefBody(form: FormState, labels: NeighborhoodInquiryFormProps['labels']) {
  const tierLabel =
    form.tier === 'browse'
      ? labels.tierBrowse
      : form.tier === 'revisited'
        ? labels.tierRevisited
        : form.tier === 'research'
          ? labels.tierResearch
          : form.tier

  return [
    'Neighborhood Commissions inquiry',
    '',
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    `Neighborhood / address: ${form.neighborhood}`,
    `Tier: ${tierLabel}`,
    '',
    'Room / wall notes:',
    form.roomNotes || '(none)',
    '',
    'Message:',
    form.message || '(none)',
  ].join('\n')
}

export default function NeighborhoodInquiryForm({
  inquiryEmail,
  ctaLabel,
  labels,
}: NeighborhoodInquiryFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [sentViaMailto, setSentViaMailto] = useState(false)

  const update =
    (key: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }))
    }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const body = buildBriefBody(form, labels)
    const subject = encodeURIComponent(
      `Neighborhood commission — ${form.neighborhood || form.name || 'inquiry'}`
    )
    const encodedBody = encodeURIComponent(body)

    if (inquiryEmail) {
      window.location.href = `mailto:${inquiryEmail}?subject=${subject}&body=${encodedBody}`
      setSentViaMailto(true)
      return
    }

    void navigator.clipboard?.writeText(body)
    setSentViaMailto(true)
  }

  return (
    <form className="neighborhood-inquiry" onSubmit={onSubmit} noValidate={false}>
      <div className="neighborhood-inquiry-grid">
        <label className="neighborhood-field">
          <span>{labels.name}</span>
          <input
            required
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={update('name')}
          />
        </label>
        <label className="neighborhood-field">
          <span>{labels.email}</span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            value={form.email}
            onChange={update('email')}
          />
        </label>
        <label className="neighborhood-field neighborhood-field--full">
          <span>{labels.neighborhood}</span>
          <input
            required
            name="neighborhood"
            value={form.neighborhood}
            onChange={update('neighborhood')}
            placeholder="e.g. Sunset District · near 27th Ave"
          />
        </label>
        <label className="neighborhood-field neighborhood-field--full">
          <span>{labels.tier}</span>
          <select
            required
            name="tier"
            value={form.tier}
            onChange={update('tier')}
          >
            <option value="" disabled>
              —
            </option>
            <option value="browse">{labels.tierBrowse}</option>
            <option value="revisited">{labels.tierRevisited}</option>
            <option value="research">{labels.tierResearch}</option>
          </select>
        </label>
        <label className="neighborhood-field neighborhood-field--full">
          <span>{labels.roomNotes}</span>
          <textarea
            name="roomNotes"
            rows={3}
            value={form.roomNotes}
            onChange={update('roomNotes')}
            placeholder="Room dimensions, wall photos later, light direction, palette / mood, existing pieces…"
          />
        </label>
        <label className="neighborhood-field neighborhood-field--full">
          <span>{labels.message}</span>
          <textarea
            name="message"
            rows={4}
            value={form.message}
            onChange={update('message')}
          />
        </label>
      </div>

      <button type="submit" className="neighborhood-submit">
        {ctaLabel || labels.submit}
      </button>

      <p className="mt-3 text-artwork-meta text-text-muted">
        {inquiryEmail ? labels.mailtoHint : labels.noEmailHint}
      </p>
      {sentViaMailto && !inquiryEmail && (
        <p className="mt-2 text-artwork-meta text-text-dark">Brief copied to clipboard.</p>
      )}
    </form>
  )
}
