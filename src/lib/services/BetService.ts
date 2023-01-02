import { PUBLIC_API_URL } from '$env/static/public'
import { get } from 'svelte/store'

import { authStore } from '$lib/stores/authStore'

export type ApiBet = {
  id: string
  numbers: string[]
  userId: string
  createdAt: string
}

export class BetService {
  private apiUrl: string

  constructor() {
    this.apiUrl = PUBLIC_API_URL as string
  }

  async listBets() {
    const response = await fetch(`${this.apiUrl}/bets`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${get(authStore).token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw data
    }

    return data as { bets: ApiBet[] }
  }

  async createBet(input: { numbers: string[] }) {
    const response = await fetch(`${this.apiUrl}/bets`, {
      method: 'POST',
      body: JSON.stringify(input),
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${get(authStore).token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw data
    }

    return data as { bet: ApiBet }
  }

  async updateBet({ id, numbers }: { id: string, numbers: string[] }) {
    const response = await fetch(`${this.apiUrl}/bets/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ id, numbers }),
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${get(authStore).token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw data
    }

    return data as { bet: ApiBet }
  }

  async deleteBet(id: string) {
    const response = await fetch(`${this.apiUrl}/bets/${id}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${get(authStore).token}`,
      },
    })

    if (!response.ok) {
      throw await response.json()
    }
  }
}
