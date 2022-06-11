import * as t from '@onflow/types'
import { arg } from '@onflow/fcl'
import { toUFix64, withPrefix } from '../shared/misc'
import { IFlowAccount, ITransactProps } from '../type'
import { execute, transact } from './interactions'

/**
 * Sends transaction to mint specified amount of FlowToken and send it to recipient.
 * Returns result of the transaction.
 * @param {string} admin - authorizing account
 * @param {string} recipient - recipient account
 * @param {number} amount - amount to mint and send
 * @returns {Promise<*>}
 */
export const mintFlow = async (
  admin: IFlowAccount,
  recipient: IFlowAccount,
  amount: number,
) => {
  const name = 'flow/mint_tokens'
  const signers = [admin]
  const args = [
    arg(withPrefix(recipient.address), t.Address),
    arg(toUFix64(amount), t.UFix64),
  ]

  return transact({
    name,
    signers,
    args,
  })
}

/**
 * Transfer a specified amount of FlowToken to recipient.
 * Returns result of the transaction.
 * @param {string} sender - authorizing account
 * @param {string} to - recipient account
 * @param {number} amount - amount to transfer
 * @returns {Promise<*>}
 */
export const transferFlowCdc = async (
  sender: IFlowAccount,
  to: IFlowAccount,
  amount: number,
  props?: Partial<ITransactProps>,
) => {
  const name = 'flow/transfer_tokens'
  const args = [arg(toUFix64(amount), t.UFix64), arg(withPrefix(to.address), t.Address)]
  const signers = [sender]

  return transact({ ...(props ?? {}), name, args, signers })
}

/**
 * Gets the amount of FlowToken owned by an account
 * Returns result of the transaction.
 * @param {string} address - account address
 * @returns {Promise<*>}
 */
export const getFlowBalanceCdc = async (address: string) => {
  const name = 'flow/get_balance'
  const args = [arg(withPrefix(address), t.Address)]

  return execute(name, args)
}

/**
 * Returns FlowToken balance for an account
 *
 * @param address - account address
 * @returns Account's FlowToken balance
 */
export const getFlowBalance = async (address: string): Promise<number> => {
  const balanceUfix = await getFlowBalanceCdc(address)
  const balance = parseFloat(balanceUfix)

  if (isNaN(balance)) {
    throw new Error(`Flow balance is not a number: ${balanceUfix}`)
  }
  return balance
}
