import { conformToMask } from 'text-mask-core'

import type { InputMaskDefinition } from '$lib/actions/useInputMask'

export function unmask(value: string, mask: InputMaskDefinition) {
  const onlyValuesMaskDefinition = mask.filter((def) => typeof def !== 'string')

  const results = conformToMask(value, onlyValuesMaskDefinition, { guide: false })

  return results.conformedValue as string
}
