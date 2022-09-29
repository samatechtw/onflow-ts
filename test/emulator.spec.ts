import 'isomorphic-fetch'
import { config } from '@onflow/config'
import { afterAll, beforeAll, beforeEach, describe, it, jest } from '@jest/globals'
import {
  AccountManager,
  emulator,
  logFilter,
  getFlowBalance,
  IFlowAccount,
  mintFlow,
  testSetup,
  transferFlowCdc,
} from '../lib'

jest.setTimeout(5000)

describe('Emulator interactions', () => {
  const port = 7001

  it('starts and stops the emulator', async () => {
    const accessNode = `http://127.0.0.1:${port}`
    config().put('accessNode.api', accessNode)
    emulator.setLogFilter(logFilter)
    await emulator.start({
      restPort: port,
    })
    await emulator.stop()

    // Start and stop again to test reset
    await emulator.start({
      restPort: port,
    })
    await emulator.stop()
  })

  describe('Emulator Test Accounts', () => {
    const accounts = new AccountManager()
    let Admin: IFlowAccount
    beforeAll(async () => {
      await testSetup({ restPort: 7002 })
    })

    beforeEach(() => {
      console.log(expect.getState().currentTestName)
    })

    // Stop emulator, so it could be restarted
    afterAll(async () => {
      await emulator.stop()
    })

    it('creates an admin account', () => {
      Admin = accounts.register('accounts/emulator-account')
      expect(Admin).toBeTruthy()
    })

    it('creates user accounts', () => {
      const Eve = accounts.register('accounts/emulator-account-eve')
      const Frank = accounts.register('accounts/emulator-account-frank')

      expect(Eve).toBeTruthy()
      expect(Frank).toBeTruthy()

      expect(Eve).not.toEqual(Admin)
      expect(Frank).not.toEqual(Admin)
      expect(Eve).not.toEqual(Frank)
    })

    describe('uses multiple keys on one account', () => {
      let Eve: IFlowAccount
      let Eve2: IFlowAccount

      it('signs a transaction with keyId 1', async () => {
        Eve = await accounts.create(Admin, 'accounts/emulator-account-eve')
        await mintFlow(Admin, Eve, 10.0)

        const balanceBefore = await getFlowBalance(Eve.address)

        await accounts.addKey(Eve, 'accounts/emulator-account-eve')

        Eve2 = {
          ...Eve,
          keyId: 1,
        }
        // Send 1 Flow with Eve's first key
        await transferFlowCdc(Eve, Admin, 1)
        // Send 1 Flow with Eve's second key
        await transferFlowCdc(Eve2, Admin, 1)

        const balance = await getFlowBalance(Eve.address)
        expect(balance).toEqual(balanceBefore - 2)
      })

      it('fails to send multiple transactions with the same key', async () => {
        const tx1 = transferFlowCdc(Eve, Admin, 1, { waitForSealed: false })
        const tx2 = transferFlowCdc(Eve, Admin, 1, { waitForSealed: false })

        await expect(Promise.all([tx1, tx2])).rejects.toThrowError(
          'has already been submitted',
        )
      })

      it('sends multiple transactions with different keys', async () => {
        const balanceBefore = await getFlowBalance(Eve.address)

        const tx1 = transferFlowCdc(Eve, Admin, 1, { waitForSealed: false })
        const tx2 = transferFlowCdc(Eve2, Admin, 1, { waitForSealed: false })

        await expect(Promise.all([tx1, tx2])).resolves.not.toThrow()

        const balance = await getFlowBalance(Eve.address)
        expect(balance).toEqual(balanceBefore - 2)
      })
    })
  })
})
