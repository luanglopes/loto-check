<script lang="ts">
  import { z } from 'zod'
  import { createEventDispatcher } from 'svelte'

  import { inputMask } from '$lib/actions/useInputMask'
  import { unmask } from '$lib/utils/unmask'

  let phoneValue = ''
  let phone = ''
  let isValid = true

  const dispatcher = createEventDispatcher()

  const schema = z.object({
    phone: z
      .string()
      .trim()
      .regex(/\d{11}/),
  })
  const phoneMask = [
    '(',
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ]

  $: phone = unmask(phoneValue, phoneMask)

  async function onSubmit() {
    const validationResult = await schema.safeParseAsync({ phone })

    if (!validationResult.success) {
      isValid = false
      return
    }

    validationResult.data

    dispatcher('submit', validationResult.data)
  }
</script>

<form class="flex flex-col gap-6 w-full" on:submit|preventDefault={onSubmit}>
  <label for="phone">
    <span>Telefone</span>
    <input
      type="tel"
      aria-keyshortcuts=""
      placeholder="(55) 99999-9999"
      id="phone"
      bind:value={phoneValue}
      on:change={() => (isValid = true)}
      class:input-invalid={!isValid}
      use:inputMask={{ mask: phoneMask }}
      required
    />
    {#if !isValid}
      <span class="text-xs !text-red-300 m-0 mt-2">Telefone inválido</span>
    {/if}
  </label>

  <button type="submit" class="btn btn-filled-primary btn-base">Login</button>

  <a href="/signup" class="self-center">Criar conta</a>
</form>
