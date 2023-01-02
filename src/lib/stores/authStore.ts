import { toastStore } from '@skeletonlabs/skeleton'
import { writable } from 'svelte/store'

import type { User } from '$lib/domain/entities/User'
import { AuthService, type Credentials } from '$lib/services/AuthService'

type AuthStoreState = {
  initialized: boolean
  isAuthenticated: boolean
  token: string | null
  user: User | null
}

function createAuthStore() {
  const initialState: AuthStoreState = {
    isAuthenticated: false,
    token: null,
    user: null,
    initialized: false,
  }

  const { set, subscribe, update } = writable<AuthStoreState>(initialState)

  const localStorageTokenKey = 'auth-token'

  return {
    subscribe,
    async init() {
      let newState = { ...initialState, initialized: true }

      const token = localStorage.getItem(localStorageTokenKey)

      if (token) {
        try {
          const authService = new AuthService()

          const { user } = await authService.getProfile(token)

          newState = { ...newState, isAuthenticated: true, token, user }
        } catch (error) {
          localStorage.removeItem(localStorageTokenKey)
        }
      }

      set(newState)
    },
    async login(credentials: Credentials) {
      const authService = new AuthService()

      try {
        const { user, token } = await authService.login(credentials)

        localStorage.setItem(localStorageTokenKey, token)

        update((current) => ({ ...current, isAuthenticated: true, token, user }))
      } catch (error) {
        toastStore.trigger({
          message: 'Ops.. Algo deu errado, verifique o número de telefone e tente novamente',
          preset: 'error',
        })
      }
    },
    logout() {
      localStorage.removeItem(localStorageTokenKey)

      update((current) => ({ ...current, isAuthenticated: false, user: null, token: null }))
    },
  }
}

export const authStore = createAuthStore()
