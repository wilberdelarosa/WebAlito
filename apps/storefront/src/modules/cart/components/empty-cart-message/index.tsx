import { Heading, Text } from "@modules/common/components/ui"

import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = () => {
  return (
    <div className="py-48 px-2 flex flex-col justify-center items-start" data-testid="empty-cart-message">
      <Heading
        level="h1"
        className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
      >
        Borrador de cotizacion
      </Heading>
      <Text className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        Aun no tienes materiales, camiones o equipos en el borrador. Explora
        el catalogo operativo y agrega lo que quieres cotizar.
      </Text>
      <div>
        <InteractiveLink href="/store">Explorar catalogo</InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
