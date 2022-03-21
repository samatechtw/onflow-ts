import { IFlowAccount } from '../type/i-flow-account'
import { getFusdBalanceCdc } from '../node/fusd'
import { getFusdBalance } from './fusd'

jest.mock('../node/fusd')

// Necessary to get TypeScript typings
const mockedGetFusdBalanceCdc = getFusdBalanceCdc as jest.MockedFunction<
  typeof getFusdBalanceCdc
>

// Values used in tests
const adminAccountMock: IFlowAccount = {
  address: '12345',
  privateKey: '12345',
}

describe('getFusdBalance()', () => {
  it('returns FUSD balance 0', async () => {
    mockedGetFusdBalanceCdc.mockResolvedValueOnce('0.00000000')
    const balance = await getFusdBalance(adminAccountMock)
    expect(balance).toBe(0)
  })

  it('returns FUSD balance above 0', async () => {
    mockedGetFusdBalanceCdc.mockResolvedValueOnce('100.00000000')
    const balance = await getFusdBalance(adminAccountMock)
    expect(balance).toBe(100)
  })

  it('returns FUSD balance below 0', async () => {
    mockedGetFusdBalanceCdc.mockResolvedValueOnce('-100.00000000')
    const balance = await getFusdBalance(adminAccountMock)
    expect(balance).toBe(-100)
  })

  it('throws an error if returned balance value is not a number', async () => {
    mockedGetFusdBalanceCdc.mockResolvedValueOnce('abc')
    await expect(getFusdBalance(adminAccountMock)).rejects.toThrow(
      'FUSD balance is not a number: abc',
    )
  })
})
