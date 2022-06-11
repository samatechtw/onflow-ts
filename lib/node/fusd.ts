import { arg } from '@onflow/fcl'
import * as t from '@onflow/types'
import { IFlowAccount } from '../type'
import { deploy, transact, execute } from './interactions'
import { toUFix64 } from '../shared/misc'

/*
 * Deploys FUSD contract to the account
 * @param {IFlowAccount} account - the account to deploy the FUSD contract on
 * @throws If execution will be halted
 * @returns {Promise<*>}
 * */
export const deployFusd = async (account: IFlowAccount) => {
  await deploy({ name: 'FUSD', auth: account })
}

/*
 * Sets up FUSD vault and capabilities to receive FUSDs and check the balance
 * @param {IFlowAccount} account - the account to enable FUSDs on
 * @throws If execution will be halted
 * @returns {Promise<*>}
 * */
export const setupFusdOnAccountCdc = (account: IFlowAccount) => {
  const name = 'fusd/setup_account'
  const signers = [account]
  return transact({
    name,
    signers,
  })
}

/*
 * Mints FUSD tokens to the recipient account
 * @param {IFlowAccount} admin - FUSD token admin
 * @param {IFlowAccount} recipient - the account to receive FUSD once minted
 * @param {UFix64} amount - amount of FUSD tokens to receive
 * @throws If execution will be halted
 * @returns {Promise<*>}
 * */
export const mintFusdToAccountCdc = async (
  admin: IFlowAccount,
  recipient: IFlowAccount,
  amount: number,
) => {
  const name = 'fusd/mint_tokens'
  const signers = [admin]
  const args = [arg(recipient.address, t.Address), arg(toUFix64(amount), t.UFix64)]

  return transact({
    name,
    signers,
    args,
  })
}

/*
 * Retrieves the FUSD tokens balance on the account
 * @param {IFlowAccount} account - the account which balance to check
 * @throws If execution will be halted
 * @returns {Promise<*>}
 * */
export const getFusdBalanceCdc = async (account: IFlowAccount) => {
  const name = 'fusd/get_balance'
  const args = [arg(account.address, t.Address)]

  return execute(name, args)
}

/*
 * Transfers FUSD tokens to recipient's account
 * @param {string} recipient - transfer recipient
 * @param {UFix64} amount - amount of FUSD tokens to transfer
 * @param {IFlowAccount} signer - transaction signer (or sender)
 * @throws If execution will be halted
 * @returns {Promise<*>}
 * */
export const transferFusdCdc = async (
  amount: number,
  recipient: string,
  signer: IFlowAccount,
) => {
  const name = 'fusd/transfer_tokens'
  const args = [arg(toUFix64(amount), t.UFix64), arg(recipient, t.Address)]
  const signers = [signer]

  return transact({ name, args, signers })
}
