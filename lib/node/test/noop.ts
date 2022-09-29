import { IFlowAccount } from '../../type'
import { transferFlowCdc } from '../flow'

// Transfers money from one account to another to increase the blocks height.
export const noop = async (user1: IFlowAccount, user2: IFlowAccount, txCount = 1) => {
  for (let i = 0; i < txCount; i++) {
    await transferFlowCdc(user1, user2, 0)
  }
}
