import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="py-12">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <>
          <div className="mb-8 border border-ui-border-base bg-ui-bg-subtle p-6">
            <p className="txt-compact-small-plus uppercase text-ui-fg-muted">
              ALITO cotizador
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-ui-fg-base">
              Este borrador no es una orden: es la base de la solicitud.
            </h1>
            <p className="mt-3 max-w-[44rem] text-ui-fg-subtle">
              Agrega materiales, camiones o equipos. En el siguiente paso se
              completa la ubicacion, fecha, restricciones y datos del cliente.
            </p>
          </div>
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-40">
            <div className="flex flex-col bg-white py-6 gap-y-6">
              {!customer && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )}
              <ItemsTemplate cart={cart} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart && cart.region && (
                  <>
                    <div className="bg-white py-6">
                      <Summary cart={cart} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          </>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
