import { Text } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper">
        <div className="relative">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
          {!product.thumbnail && !product.images?.length && (
            <div className="absolute inset-0 flex items-end p-3">
              <span className="bg-white/90 px-2 py-1 txt-compact-small text-ui-fg-subtle">
                Imagen pendiente
              </span>
            </div>
          )}
        </div>
        <div className="flex txt-compact-medium mt-4 justify-between">
          <div>
            <Text className="text-ui-fg-base" data-testid="product-title">
              {product.title}
            </Text>
            <Text className="mt-1 txt-compact-small text-ui-fg-muted">
              Agregar a borrador de cotizacion
            </Text>
          </div>
          <div className="flex items-center gap-x-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
