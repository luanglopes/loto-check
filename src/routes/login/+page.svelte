<script lang="ts">
  import LoginForm from '$lib/components/LoginForm.svelte'
  import { authStore } from '$lib/stores/authStore'
  import { Divider } from '@skeletonlabs/skeleton'

  async function handleSubmit(event: CustomEvent) {
    authStore.login(event.detail)
  }
</script>

<div class="container h-full mx-auto flex justify-center items-center p-4 md:p-0">
  <div class="card p-6 flex flex-col gap-6 items-center w-full sm:max-w-xs">
    <h2>Login</h2>

    <Divider />

    <LoginForm on:submit={handleSubmit} />
  </div>
</div>
