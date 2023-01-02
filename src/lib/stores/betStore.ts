import { toastStore } from '@skeletonlabs/skeleton'
import { writable } from 'svelte/store'

import type { Bet } from '$lib/domain/entities/Bet'
import { BetService } from '$lib/services/BetService'
import { BetMapper } from '$lib/dataMappers/BetMapper'

export type StateBet = Bet & { hits: number }

export type BetStoreState = {
  betsMap: Record<string, StateBet>
  winningNumbers: Set<string>
}

function createBetStore() {
  const { subscribe, update } = writable<BetStoreState>({ betsMap: {}, winningNumbers: new Set() })

  return {
    subscribe,
    async lisBets() {
      let success = false

      const betService = new BetService()

      try {
        const response = await betService.listBets()

        update((current) => {
          const { winningNumbers } = current

          const betsMap: BetStoreState['betsMap'] = {}

          response.bets.forEach((apiBet) => {
            const bet = BetMapper.toStore(BetMapper.fromApi(apiBet), winningNumbers)

            betsMap[apiBet.id] = bet
          })

          return { ...current, betsMap }
        })

        success = true
      } catch (error) {
        console.log(error)

        update((current) => ({ ...current, betsMap: {} }))

        toastStore.trigger({
          preset: 'error',
          message: 'Erro ao listar apostas',
        })
      }

      return { success }
    },
    async createBet(data: { numbers: string[] }) {
      let success = false

      const betService = new BetService()

      try {
        const response = await betService.createBet(data)

        update((current) => {
          const { winningNumbers } = current
          const newBetsMap = {
            [response.bet.id]: BetMapper.toStore(BetMapper.fromApi(response.bet), winningNumbers),
            ...current.betsMap,
          }

          return {
            ...current,
            betsMap: newBetsMap,
          }
        })

        success = true
      } catch (error) {
        console.log(error)

        toastStore.trigger({
          preset: 'error',
          message: 'Erro ao criar aposta',
        })
      }

      return { success }
    },
    async updateBet(data: Bet) {
      let success = false
      const betService = new BetService()

      try {
        const response = await betService.updateBet(BetMapper.toApi(data))

        update((current) => {
          const { winningNumbers } = current
          const newBetsMap = { ...current.betsMap }

          newBetsMap[response.bet.id] = BetMapper.toStore(BetMapper.fromApi(response.bet), winningNumbers)

          return {
            ...current,
            betsMap: newBetsMap,
          }
        })

        success = true
      } catch (error) {
        console.log(error)

        toastStore.trigger({
          preset: 'error',
          message: 'Erro ao editar aposta',
        })
      }

      return { success }
    },
    async removeBet(betId: string) {
      let success = false

      const betService = new BetService()

      try {
        await betService.deleteBet(betId)

        update((current) => {
          const newBetsMap = { ...current.betsMap }

          delete newBetsMap[betId]

          return {
            ...current,
            betsMap: newBetsMap,
          }
        })

        success = true
      } catch (error) {
        console.log(error)

        toastStore.trigger({
          preset: 'error',
          message: 'Erro ao remover aposta',
        })
      }

      return { success }
    },
    setWinningNumbers({ numbers }: { numbers: Set<string> }) {
      update(({ betsMap, ...current }) => {
        const newBetsMap = { ...betsMap }

        Object.values(newBetsMap).forEach(bet => {

          newBetsMap[bet.id] = BetMapper.toStore(bet, numbers)
        })
        return {
          ...current,
          winningNumbers: numbers,
          betsMap: newBetsMap
        }
      })
    },
  }
}

export const betStore = createBetStore()
