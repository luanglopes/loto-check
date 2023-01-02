<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import BetNumbers from './BetNumbers.svelte'

  export let selectedNumbers: Set<string> = new Set()

  let allNumbers = new Set(Array.from({ length: 60 }).map((_, i) => String(i + 1).padStart(2, '0')))

  const dispatch = createEventDispatcher()

  function handleNumber(e: CustomEvent<{ number: string }>) {
    dispatch('numberClick', { number: e.detail.number })
  }
</script>

<div class="border p-4 rounded-md">
  <BetNumbers
    isInteractive
    numbers={allNumbers}
    highlightedNumbers={selectedNumbers}
    on:numberClick={handleNumber}
  />
</div>

<div class="flex justify-center">
  {#if selectedNumbers.size === 0}
    Nenhum número selecionado
  {:else}
    <BetNumbers numbers={selectedNumbers} />
  {/if}
</div>
