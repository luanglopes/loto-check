<script lang="ts">
  import { betStore } from '$lib/stores/betStore'
  import { modalStore } from '@skeletonlabs/skeleton'
  import BetForm from './BetForm.svelte'

  let selectedNumbers: Set<string> = new Set()

  function toggleNumber(e: CustomEvent<{ number: string }>) {
    if (selectedNumbers.has(e.detail.number)) {
      selectedNumbers.delete(e.detail.number)
    } else {
      selectedNumbers.add(e.detail.number)
    }

    selectedNumbers = selectedNumbers
  }

  async function handleCreate() {
    const result = await betStore.createBet({ numbers: Array.from(selectedNumbers) })

    if (result.success) {
      modalStore.close()
    }
  }

  function handleCancel() {
    modalStore.close()
  }
</script>

<h3>Criar Aposta</h3>

<BetForm {selectedNumbers} on:numberClick={toggleNumber} />

<div class="flex justify-end gap-4">
  <button class="btn btn-ghost-primary btn-base" on:click={handleCancel}>Cancelar</button>
  <button class="btn btn-filled-primary btn-base" on:click={handleCreate}>Criar</button>
</div>
