<script lang="ts">
  import '../theme.postcss'
  import '@skeletonlabs/skeleton/styles/all.css'
  import '../app.postcss'

  import { goto } from '$app/navigation'
  import { Modal, Toast } from '@skeletonlabs/skeleton'
  import { onMount } from 'svelte'

  import { authStore } from '$lib/stores/authStore'

  let initialized = false

  async function init() {
    if (!$authStore.initialized) {
      return
    }

    const currentPath = window.location.pathname

    const guestRoutes = ['/login', '/signin']

    const isProtected = !guestRoutes.includes(currentPath)

    if (isProtected && !$authStore.isAuthenticated) {
      await goto('/login')
    }

    if (!isProtected && $authStore.isAuthenticated) {
      await goto('/')
    }

    initialized = true
  }

  $: {
    if ($authStore.initialized) {
      init()
    }
  }

  onMount(() => {
    if (!$authStore.initialized) {
      authStore.init()
    }
  })
</script>

<svelte:head>
  <title>Loto Check</title>
  <meta name="description" content="App to check loto bets." />
</svelte:head>

<Modal />

<Toast />

{#if initialized}
  <slot />
{/if}
