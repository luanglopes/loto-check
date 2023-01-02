<script lang="ts">
  import { Divider, modalStore } from '@skeletonlabs/skeleton'

  import EditBet from './EditBet.svelte'
  import BetNumbers from './BetNumbers.svelte'
  import type { Bet } from '$lib/domain/entities/Bet'
  import { betStore, type StateBet } from '$lib/stores/betStore'

  function handleRemove(betId: string) {
    modalStore.trigger({
      type: 'confirm',
      title: 'Remover Aposta',
      body: 'Tem certeza que deseja remover essa aposta?',
      response: (r: boolean) => r && betStore.removeBet(betId),
      buttonTextCancel: 'Não',
      buttonTextConfirm: 'Sim',
      classes: '!max-w-[400px]',
    })
  }

  function openEditBetForm(bet: Bet) {
    modalStore.trigger({
      type: 'component',
      component: {
        ref: EditBet,
        props: { bet },
      },
    })
  }

  function sortBets(a: StateBet, b: StateBet) {
    if (a.hits > b.hits) {
      return -1
    }

    if (a.hits < b.hits) {
      return 1
    }

    return 0
  }

  $: sortedBets =
    $betStore.winningNumbers.size > 0
      ? Object.values($betStore.betsMap).sort(sortBets)
      : Object.values($betStore.betsMap)
</script>

<div class="flex flex-col flex-1 w-full items-center gap-4 max-w-md pb-4 px-4 md:px-0">
  {#if Object.values($betStore.betsMap).length === 0}
    <span class="text-primary-300">Nenhuma aposta</span>
  {/if}

  {#each sortedBets as bet}
    <div class="card w-full">
      <div class="p-6">
        <BetNumbers numbers={bet.numbers} highlightedNumbers={$betStore.winningNumbers} />
      </div>

      <Divider />

      <footer class="card-footer flex justify-end pt-4 gap-4">
        <button class="btn btn-ghost-tertiary btn-sm" on:click={() => openEditBetForm(bet)}>
          Editar
        </button>

        <button class="btn btn-ghost-error btn-sm" on:click={() => handleRemove(bet.id)}
          >Remover</button
        >
      </footer>
    </div>
  {/each}
</div>
