import { PUBLIC_API_URL } from '$env/static/public'

import type { User } from '$lib/domain/entities/User'

export type Credentials = {
  phone: string
}

export class AuthService {
  private apiUrl: string

  constructor() {
    this.apiUrl = PUBLIC_API_URL as string
  }

  async login(credentials: Credentials) {
    const response = await fetch(`${this.apiUrl}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'content-type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw data
    }

    return data as { token: string; user: User }
  }

  async signup(credentials: Credentials) {
    const response = await fetch(`${this.apiUrl}/signup`, {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'content-type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw data
    }

    return data as { token: string; user: User }
  }

  async getProfile(token: string) {
    const response = await fetch(`${this.apiUrl}/profile`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw data
    }

    return data as { user: User }
  }
}
