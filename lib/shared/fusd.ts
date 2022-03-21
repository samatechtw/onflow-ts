import { IFlowAccount } from '../type/i-flow-account'
import { getFusdBalanceCdc } from '../node/fusd'

/**
 * Returns FUSD balance for an account
 *
 * @param account - account to check the balance
 * @returns FUSD balance on the account
 */
export const getFusdBalance = async (account: IFlowAccount): Promise<number> => {
  const fusdAmount = await getFusdBalanceCdc(account)
  const balance = parseFloat(fusdAmount)

  if (isNaN(balance)) {
    throw new Error(`FUSD balance is not a number: ${fusdAmount}`)
  }
  return balance
}
