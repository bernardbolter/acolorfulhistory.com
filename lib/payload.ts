import type { AppLocale } from '@/lib/mappers/richText'

export interface PayloadClientConfig {
  baseUrl: string
  apiKey?: string
  enabled: boolean
}

const DEFAULT_REVALIDATE = 3600

export function getPayloadConfig(): PayloadClientConfig {
  const baseUrl = (
    process.env.PAYLOAD_API_URL ||
    process.env.NEXT_PUBLIC_PAYLOAD_API_URL ||
    ''
  ).replace(/\/$/, '')

  const apiKey = process.env.PAYLOAD_API_KEY

  return {
    baseUrl,
    apiKey,
    enabled: Boolean(baseUrl),
  }
}

export interface PayloadFetchOptions {
  locale?: AppLocale | string
  searchParams?: Record<string, string | number | boolean | undefined>
  revalidate?: number | false
  tags?: string[]
  /** When true, 404 responses return null without logging an error. */
  optional?: boolean
  /** When true, failed responses return null without logging an error. */
  silent?: boolean
  /** When true, bypass Next.js fetch cache (required for large Payload list responses). */
  noStore?: boolean
}

function buildSearchParams(
  options?: PayloadFetchOptions
): URLSearchParams {
  const params = new URLSearchParams()

  if (options?.locale) {
    params.set('locale', options.locale)
  }

  if (options?.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      if (value === undefined) continue
      params.set(key, String(value))
    }
  }

  return params
}

export async function payloadFetch<T>(
  path: string,
  options?: PayloadFetchOptions
): Promise<T | null> {
  const config = getPayloadConfig()
  if (!config.enabled) return null

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const params = buildSearchParams(options)
  const query = params.toString()
  const url = `${config.baseUrl}${normalizedPath}${query ? `?${query}` : ''}`

  const headers: HeadersInit = {
    Accept: 'application/json',
  }

  if (config.apiKey) {
    headers.Authorization = `users API-Key ${config.apiKey}`
  }

  const revalidate = options?.revalidate ?? DEFAULT_REVALIDATE

  try {
    const res = await fetch(url, {
      headers,
      ...(options?.noStore
        ? { cache: 'no-store' as const }
        : {
            next:
              revalidate === false
                ? { revalidate: 0 }
                : { revalidate, tags: options?.tags },
          }),
    })

    if (!res.ok) {
      const shouldLog = !(options?.optional && res.status === 404) && !options?.silent
      if (shouldLog) {
        console.error(`Payload fetch failed: ${res.status} ${res.statusText} — ${url}`)
      }
      return null
    }

    return (await res.json()) as T
  } catch (error) {
    console.error('Payload fetch error:', error)
    return null
  }
}

export async function payloadFindDocs<T>(
  collection: string,
  options?: PayloadFetchOptions
): Promise<T[]> {
  const response = await payloadFetch<{ docs?: T[] }>(`/api/${collection}`, {
    ...options,
    searchParams: {
      limit: 1000,
      depth: 2,
      ...options?.searchParams,
    },
  })

  return response?.docs ?? []
}

export async function payloadFindOneBySlug<T>(
  collection: string,
  slug: string,
  options?: PayloadFetchOptions
): Promise<T | null> {
  const response = await payloadFetch<{ docs?: T[] }>(`/api/${collection}`, {
    ...options,
    searchParams: {
      limit: 1,
      depth: 2,
      'where[slug][equals]': slug,
      ...options?.searchParams,
    },
  })

  return response?.docs?.[0] ?? null
}

export async function payloadFindOneByField<T>(
  collection: string,
  field: string,
  value: string,
  options?: PayloadFetchOptions
): Promise<T | null> {
  const response = await payloadFetch<{ docs?: T[] }>(`/api/${collection}`, {
    ...options,
    searchParams: {
      limit: 1,
      depth: 2,
      [`where[${field}][equals]`]: value,
      ...options?.searchParams,
    },
  })

  return response?.docs?.[0] ?? null
}

export async function payloadGetGlobal<T>(
  slug: string,
  options?: PayloadFetchOptions
): Promise<T | null> {
  return payloadFetch<T>(`/api/globals/${slug}`, {
    ...options,
    searchParams: {
      depth: 2,
      ...options?.searchParams,
    },
  })
}
