import { CadenceEvent } from '@samatech/onflow-fcl-esm'
import { findEvent } from './find-event'

const event1: CadenceEvent = {
  blockId: 'b6005443c0874c8a2f3cd9b3613732e6163a66b534215144643a8ed12e5d3383',
  blockHeight: 23839302,
  blockTimestamp: '2022-02-10T04:13:13.061Z',
  type: 'A.f8d6e0586b0a20c7.FUSD.TokensWithdrawn',
  transactionId: 'c37b493e4c9c94c50f2c6aec555d8f8fd97b42be0a053ce75f11aceb5022a416',
  transactionIndex: 1,
  eventIndex: 0,
  data: {
    amount: '10.00000000',
    from: '0x01cf0e2f2f715450',
  },
}

const event2: CadenceEvent = {
  blockId: 'b6005443c0874c8a2f3cd9b3613732e6163a66b534215144643a8ed12e5d3383',
  blockHeight: 23839302,
  blockTimestamp: '2022-02-10T04:13:13.061Z',
  type: 'A.f8d6e0586b0a20c7.NFTStorefront.Purchase',
  transactionId: 'c37b493e4c9c94c50f2c6aec555d8f8fd97b42be0a053ce75f11aceb5022a416',
  transactionIndex: 1,
  eventIndex: 3,
  data: {
    blueprintId: 1,
    sold: 1,
    soldOut: true,
  },
}

const event3: CadenceEvent = {
  blockId: 'b6005443c0874c8a2f3cd9b3613732e6163a66b534215144643a8ed12e5d3383',
  blockHeight: 23839302,
  blockTimestamp: '2022-02-10T04:13:13.061Z',
  type: 'A.f8d6e0586b0a20c7.NFT.Deposit',
  transactionId: 'c37b493e4c9c94c50f2c6aec555d8f8fd97b42be0a053ce75f11aceb5022a416',
  transactionIndex: 1,
  eventIndex: 4,
  data: {
    id: 1,
    to: '0x01cf0e2f2f715450',
  },
}

describe('sharedUtilFlow', () => {
  describe('find event', () => {
    it('returns event id with the default prefix', () => {
      const events: CadenceEvent[] = [event1, event2, event3]
      const type = 'FUSD.TokensWithdrawn'
      expect(findEvent(events, type)).toEqual(event1)
    })

    it('returns undefined if cannot find a matching event', () => {
      const events: CadenceEvent[] = [event1, event2, event3]
      const type = 'Bogus.EventType'
      expect(findEvent(events, type)).toBe(undefined)
    })

    it('returns undefined if no events were provided for search', () => {
      const events: CadenceEvent[] = []
      const type = 'NFTStorefront.Purchase'
      expect(findEvent(events, type)).toBe(undefined)
    })
  })
})
