import { arg } from '@samatech/onflow-fcl-esm'
import * as t from '@onflow/types'
import { IFlowAccount } from '../type'
import { deploy, transact, execute } from './interactions'
import { toUFix64 } from '../shared/misc'

export const deployFusd = async (account: IFlowAccount) => {
  await deploy({ name: 'FUSD', auth: account })
}

export const setupFusdOnAccount = (account: IFlowAccount) => {
  const name = 'fusd/setup_account'
  const signers = [account]
  return transact({
    name,
    signers,
  })
}

export const mintFusdToAccount = async (
  admin: IFlowAccount,
  toAccount: IFlowAccount,
  amount: number,
) => {
  const name = 'fusd/mint_tokens'
  const signers = [admin]
  const args = [arg(toAccount.address, t.Address), arg(toUFix64(amount), t.UFix64)]

  return transact({
    name,
    signers,
    args,
  })
}

export const getFusdBalance = async (account: IFlowAccount) => {
  const name = 'fusd/get_balance'
  const args = [arg(account.address, t.Address)]

  return execute(name, args)
}
