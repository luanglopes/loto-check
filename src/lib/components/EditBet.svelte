<script lang="ts">
  import { modalStore } from '@skeletonlabs/skeleton'

  import type { Bet } from '$lib/domain/entities/Bet'
  import { betStore } from '$lib/stores/betStore'

  import BetForm from './BetForm.svelte'

  export let bet: Bet

  let selectedNumbers = bet.numbers

  function toggleNumber(e: CustomEvent<{ number: string }>) {
    if (selectedNumbers.has(e.detail.number)) {
      selectedNumbers.delete(e.detail.number)
    } else {
      selectedNumbers.add(e.detail.number)
    }

    selectedNumbers = selectedNumbers
  }

  async function handleSave() {
    const result = await betStore.updateBet({ ...bet, numbers: selectedNumbers })

    if (result.success) {
      modalStore.close()
    }
  }

  function handleCancel() {
    modalStore.close()
  }
</script>

<h3>Editar Aposta</h3>

<BetForm {selectedNumbers} on:numberClick={toggleNumber} />

<div class="flex justify-end gap-4">
  <button class="btn btn-ghost-primary btn-base" on:click={handleCancel}>Cancelar</button>
  <button class="btn btn-filled-primary btn-base" on:click={handleSave}>Salvar</button>
</div>
