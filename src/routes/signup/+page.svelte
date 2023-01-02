<script lang="ts">
  import SignupForm from '$lib/components/SignupForm.svelte'
  import { AuthService } from '$lib/services/AuthService'
  import { Divider, toastStore } from '@skeletonlabs/skeleton'

  async function handleSubmit(event: CustomEvent) {
    const authService = new AuthService()

    try {
      const { user, token } = await authService.signup(event.detail)

      localStorage.setItem('auth-token', token)
      localStorage.setItem('user', JSON.stringify(user))
      window.location.href = '/'
    } catch (error) {
      toastStore.trigger({
        message: 'Ops.. Algo deu errado, verifique o número de telefone e tente novamente',
        preset: 'error',
      })
    }
  }
</script>

<div class="container h-full mx-auto flex justify-center items-center p-4 md:p-0">
  <div class="card p-6 flex flex-col gap-6 items-center w-full sm:max-w-xs">
    <h2>Criar Conta</h2>

    <Divider />

    <SignupForm on:submit={handleSubmit} />
  </div>
</div>
