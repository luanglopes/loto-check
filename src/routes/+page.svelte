<script lang="ts">
  import { Divider, modalStore } from '@skeletonlabs/skeleton'
  import { onMount } from 'svelte'

  import BetsList from '$lib/components/BetsList.svelte'
  import CreateBet from '$lib/components/CreateBet.svelte'
  import { betStore } from '$lib/stores/betStore'
  import CheckBets from '$lib/components/CheckBets.svelte'
  import BetNumbers from '$lib/components/BetNumbers.svelte'

  let loading = true

  function openCreateBetForm() {
    modalStore.trigger({
      type: 'component',
      component: {
        ref: CreateBet,
      },
    })
  }

  async function fetchBets() {
    await betStore.lisBets()

    loading = false
  }

  async function openCheckBetsForm() {
    modalStore.trigger({
      type: 'component',
      component: {
        ref: CheckBets,
      },
    })
  }

  onMount(() => {
    fetchBets()
  })
</script>

<main class="w-screen h-full overflow-auto flex flex-col items-center min-h-full ">
  <div class="py-4 sticky top-0 bg-surface-900 w-full">
    <div class="w-full max-w-md mx-auto flex flex-col gap-4 px-4 md:px-0">
      <div class="flex justify-center">
        <h1>LotoCheck</h1>
      </div>

      <Divider />

      <h2>Números Sorteados</h2>

      {#if $betStore.winningNumbers.size > 0}
        <div class="flex flex-col gap-4">
          <div class="px-6">
            <BetNumbers
              numbers={$betStore.winningNumbers}
              highlightedNumbers={$betStore.winningNumbers}
            />
          </div>

          <button
            class="btn btn-ghost-error btn-sm self-end"
            on:click={() => betStore.setWinningNumbers({ numbers: new Set() })}>Limpar</button
          >
        </div>
      {:else}
        <button on:click={openCheckBetsForm} class="btn btn-filled-primary btn-base">
          Inserir números sorteados
        </button>
      {/if}

      <Divider />

      <div class="flex items-end justify-between">
        <h2>Minhas Apostas</h2>

        <span class="text-primary-200 text-sm">
          Total de apostas: {Object.values($betStore.betsMap).length}
        </span>
      </div>
    </div>
  </div>

  {#if loading}
    <span class="text-primary-300">Carregando...</span>
  {:else}
    <BetsList />
  {/if}

  <div class="fixed bottom-6 right-6">
    <button class="btn-icon btn-filled-primary" on:click={openCreateBetForm}>+</button>
  </div>
</main>
