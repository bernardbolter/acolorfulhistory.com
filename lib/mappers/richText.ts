export type AppLocale = 'en' | 'de'

export function normalizeLocale(locale?: string): AppLocale {
  return locale === 'de' ? 'de' : 'en'
}

export function payloadRichTextToHtml(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') return value

  if (Array.isArray(value)) {
    return value
      .map((node) => payloadRichTextToHtml(node))
      .filter(Boolean)
      .join('')
  }

  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>
    if (typeof obj.text === 'string') {
      let text = obj.text
      if (obj.bold) text = `<strong>${text}</strong>`
      if (obj.italic) text = `<em>${text}</em>`
      return text
    }
    if (Array.isArray(obj.children)) {
      const inner = obj.children
        .map((child) => payloadRichTextToHtml(child))
        .filter(Boolean)
        .join('')
      if (obj.type === 'paragraph' || obj.type === 'p') return `<p>${inner}</p>`
      if (obj.type === 'heading') return `<h3>${inner}</h3>`
      return inner
    }
    const root = obj.root as { children?: unknown[] } | undefined
    if (Array.isArray(root?.children)) {
      return payloadRichTextToHtml(root.children)
    }
  }

  return undefined
}

export function payloadRichTextToPlain(value: unknown): string | undefined {
  const html = payloadRichTextToHtml(value)
  if (!html) return undefined
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}
