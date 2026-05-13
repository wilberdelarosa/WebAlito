"use client"

import { Button, Heading } from "@modules/common/components/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-4">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
        Resumen operativo
      </Heading>
      <div className="border border-ui-border-base bg-ui-bg-subtle p-4 txt-small text-ui-fg-subtle">
        Los valores aqui son referencia de catalogo. El precio final depende de
        zona, capacidad, acceso, disponibilidad y validacion de operaciones.
      </div>
      <Divider />
      <CartTotals totals={cart} />
      <DiscountCode cart={cart} />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <Button className="w-full h-10">Enviar solicitud</Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
