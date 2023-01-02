<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let numbers: Set<string>
  export let highlightedNumbers: Set<string> = new Set()
  export let isInteractive = false

  let type: 'span' | 'button'

  $: type = isInteractive ? 'button' : 'span'

  const dispatch = createEventDispatcher()

  function handleClick(number: string) {
    dispatch('numberClick', { number })
  }
</script>

<div class="flex flex-wrap gap-2 justify-center">
  {#each Array.from(numbers) as number}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <svelte:element
      this={type}
      on:click={isInteractive ? () => handleClick(number) : undefined}
      class="rounded-full border border-white flex items-center justify-center w-10 h-10"
      class:bg-primary-500={highlightedNumbers.has(number)}
      class:border-primary-500={highlightedNumbers.has(number)}
      style:color={highlightedNumbers.has(number) ? 'rgb(var(--on-primary))' : 'white'}
    >
      {number}
    </svelte:element>
  {/each}
</div>
