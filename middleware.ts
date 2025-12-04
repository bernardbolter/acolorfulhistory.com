// middleware.ts (project root)
import { NextRequest, NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "./src/i18n/routing"
import { HttpTypes } from "@medusajs/types"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL!
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "de"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

// ──────────────────────────────────────────────────────────────
// 1. next-intl middleware (handles /en vs /de)
// ──────────────────────────────────────────────────────────────
const intlMiddleware = createMiddleware(routing)

// ──────────────────────────────────────────────────────────────
// 2. Medusa region middleware (only runs inside /store)
// ──────────────────────────────────────────────────────────────
async function getRegionMap() {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!regionMap.size || regionMapUpdated < Date.now() - 3600 * 1000) {
    const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: { "x-publishable-api-key": PUBLISHABLE_API_KEY },
      next: { revalidate: 3600, tags: ["regions"] },
    }).then(res => res.json())

    regions?.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach(c => {
        if (c.iso_2) {
            regionMap.set(c.iso_2.toLowerCase(), region)
        }
      })
    })
    regionMapCache.regionMapUpdated = Date.now()
  }

  return regionMapCache.regionMap
}

async function handleMedusaRegion(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const segments = pathname.split("/").filter(Boolean)

  // Only run Medusa logic if we're inside /store
  if (segments[1] !== "store") {
    return null // let intl handle it
  }

  const regionMap = await getRegionMap()
  const countryFromUrl = segments[2]?.toLowerCase()
  const hasValidCountry = countryFromUrl && regionMap.has(countryFromUrl)

  // If URL already has valid country → just continue
  if (hasValidCountry) {
    return NextResponse.next()
  }

  // Determine best country (geo → default per locale → fallback)
  const locale = segments[0] // "en" or "de"
  const geoCountry = request.headers.get("x-vercel-ip-country")?.toLowerCase()
  const defaultCountry = locale === "de" ? "de" : "us"

  let targetCountry = DEFAULT_REGION
  if (geoCountry && regionMap.has(geoCountry)) {
    targetCountry = geoCountry
  } else if (regionMap.has(defaultCountry)) {
    targetCountry = defaultCountry
  } else if (regionMap.keys().next().value) {
    targetCountry = regionMap.keys().next().value as string
  }

  // Redirect to correct country
  const newPath = `/${locale}/store/${targetCountry}${pathname.replace(/\/store[^\/]*/, "/store")}`
  return NextResponse.redirect(new URL(newPath, request.url))
}

// ──────────────────────────────────────────────────────────────
// 3. Final middleware chain
// ──────────────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
  // First: handle Medusa region redirect if inside /store
  const medusaResponse = await handleMedusaRegion(request)
  if (medusaResponse) return medusaResponse

  // Then: let next-intl handle locale detection/redirects
  // This will properly handle /[locale]/artwork/[slug] routes
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes
     * - static files
     * - images
     * - favicon
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|.*\\..*).*)",
  ],
}