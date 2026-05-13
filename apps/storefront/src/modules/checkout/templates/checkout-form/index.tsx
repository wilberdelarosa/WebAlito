import { HttpTypes } from "@medusajs/types"
import AlitoQuoteForm from "@modules/checkout/components/alito-quote-form"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <AlitoQuoteForm cart={cart} customer={customer} />
    </div>
  )
}
