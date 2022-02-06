import { Account, AuthZ, sansPrefix } from '@samatech/onflow-fcl-esm'
import { authorization, authorizationMaybe } from './flow-crypto'
import { IFlowAccount } from '../type/i-flow-account'

describe('shared/flow-crypto', () => {
  describe('authorization', () => {
    it('returns authorization object for the given Flow Account', async () => {
      const flowAccount: IFlowAccount = {
        address: '0x01cf0e2f2f715450',
        privateKey: 'ab2a2c0123d720e036b8809a8a930bc16ab9dedc534a57872445092fecd139f4',
        keyId: 0,
      }

      const partialAccount = {
        address: '0x01cf0e2f2f715450',
        balance: 100,
        keys: { 0: 'ab2a2c0123d720e036b8809a8a930bc16ab9dedc534a57872445092fecd139f4' },
      }

      type authorizationFn = (acct: Partial<Account>) => Promise<AuthZ>
      const authzFn = authorization(flowAccount) as authorizationFn
      const authz = await authzFn(partialAccount)

      expect(authz).toMatchObject({
        address: partialAccount.address,
        balance: partialAccount.balance,
        keys: partialAccount.keys,
        tempId: `${sansPrefix(partialAccount.address)}-0`,
        addr: sansPrefix(partialAccount.address),
        keyId: 0,
      })
    })
  })

  describe('authorizationMaybe', () => {
    it('returns authorization function if passed a Flow Account', async () => {
      const account: IFlowAccount = {
        address: '0x01cf0e2f2f715450',
        privateKey: 'ab2a2c0123d720e036b8809a8a930bc16ab9dedc534a57872445092fecd139f4',
      }
      const authzMaybe = await authorizationMaybe(account)
      expect(typeof authzMaybe).toBe('function')
    })

    it('returns undefined if passed a non Flow Account', async () => {
      const output = await authorizationMaybe(undefined)
      expect(output).toBe(undefined)
    })
  })
})
