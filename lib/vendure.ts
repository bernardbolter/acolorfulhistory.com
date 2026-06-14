const VENDURE_SHOP_API =
  process.env.NEXT_PUBLIC_VENDURE_SHOP_API ||
  process.env.VENDURE_SHOP_API

export interface AddToCartResult {
  success: boolean
  error?: string
  orderLineId?: string
}

export function isVendureConfigured(): boolean {
  return Boolean(VENDURE_SHOP_API)
}

export async function addToCart(
  productId: string,
  quantity = 1
): Promise<AddToCartResult> {
  if (!VENDURE_SHOP_API) {
    return { success: false, error: 'Store not configured' }
  }

  try {
    const response = await fetch(`${VENDURE_SHOP_API.replace(/\/$/, '')}/shop-api`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation AddToCart($productId: ID!, $quantity: Int!) {
            addItemToOrder(productVariantId: $productId, quantity: $quantity) {
              ... on Order {
                id
                lines { id }
              }
              ... on ErrorResult {
                errorCode
                message
              }
            }
          }
        `,
        variables: { productId, quantity },
      }),
    })

    if (!response.ok) {
      return { success: false, error: `Store request failed (${response.status})` }
    }

    const json = (await response.json()) as {
      data?: { addItemToOrder?: { id?: string; lines?: { id: string }[]; message?: string } }
    }

    const result = json.data?.addItemToOrder
    if (result?.message) {
      return { success: false, error: result.message }
    }

    return {
      success: true,
      orderLineId: result?.lines?.[0]?.id,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown store error',
    }
  }
}
