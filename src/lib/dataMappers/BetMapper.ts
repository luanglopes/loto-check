import type { Bet } from '$lib/domain/entities/Bet'
import type { ApiBet } from '$lib/services/BetService'
import type { BetStoreState, StateBet } from '$lib/stores/betStore'

export class BetMapper {
  static fromApi(apiBet: ApiBet): Bet {
    return {
      ...apiBet,
      numbers: new Set(apiBet.numbers),
    }
  }

  static toApi(bet: Bet): ApiBet {
    return {
      ...bet,
      numbers: Array.from(bet.numbers),
    }
  }

  static toStore(bet: Bet, winningNumbers: BetStoreState['winningNumbers']): StateBet {
    let hits = 0

    winningNumbers.forEach(winingNum => {
      if (bet.numbers.has(winingNum)) {
        hits += 1
      }
    })

    return { ...bet, hits }
  }
}
