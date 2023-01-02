import { conformToMask } from 'text-mask-core'

export type InputMaskDefinition = Array<string | RegExp>

type UseMaskOptions = {
  mask: InputMaskDefinition
  invalidClass?: string
}

export function inputMask(node: HTMLInputElement, { mask }: UseMaskOptions) {
  const initResults = conformToMask(node.value, mask, { guide: false })

  node.value = initResults.conformedValue as string

  let previousValue = node.value

  function handleInput(e: Event) {
    e.stopPropagation()

    const input = e.target as HTMLInputElement

    const results = conformToMask(input.value, mask, {
      guide: false,
      previousConformedValue: previousValue,
    })

    input.value = results.conformedValue as string

    previousValue = input.value as string

    input.dispatchEvent(new CustomEvent('change'))
  }

  node.addEventListener('input', handleInput)

  return {
    destroy() {
      node.removeEventListener('input', handleInput)
    },
  }
}
