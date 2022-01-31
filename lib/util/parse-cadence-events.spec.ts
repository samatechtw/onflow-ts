import { IFlowPurchaseEvent } from '../type/i-flow-purchase-event'
import { purchaseFromEvents } from './parse-cadence-events'

describe('sharedUtilFlow', () => {
  describe('parse Cadence events', () => {
    describe('purchaseFromEvents', () => {
      const tokensWithdrawnEvent = {
        type: 'FUSD.TokensWithdrawn',
        data: { amount: '5.000000', from: '0x179b6b1cb6755e31' },
      }
      const tokensDepositedEvent1 = {
        type: 'FUSD.TokensDeposited',
        data: { amount: '5.000000', to: '0x01cf0e2f2f715450' },
      }
      const tokensDepositedEvent2 = {
        type: 'FUSD.TokensDeposited',
        data: { amount: '5.000000', to: '0x01cf0e2f2f715450' },
      }
      const purchaseEvent = {
        type: 'NFTStorefront.Purchase',
        data: { blueprintId: 1, sold: 1, soldOut: false },
      }
      const depositEvent = {
        type: 'NFT.Deposit',
        data: { id: 1, to: '0x179b6b1cb6755e31' },
      }

      const events = [
        tokensWithdrawnEvent,
        tokensDepositedEvent1,
        tokensDepositedEvent2,
        purchaseEvent,
        depositEvent,
      ]

      it('returns purchase event data if the Purchase event exists', () => {
        const event: IFlowPurchaseEvent | undefined = purchaseFromEvents(events)
        const { blueprintId: flowBlueprintId, sold, soldOut } = purchaseEvent.data
        expect(event).toEqual({ flowBlueprintId, sold, soldOut })
      })

      it('returns undefined if no NFT.BlueprintPrinted event found', () => {
        const purchaseEvent = purchaseFromEvents([])
        expect(purchaseEvent).toBe(undefined)
      })
    })
  })
})
