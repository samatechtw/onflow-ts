import * as t from '@onflow/types'
import { arg, Argument } from '@samatech/onflow-fcl-esm'
import { IFlowAccount } from '../type'
import { sendTransaction, replaceImportAddresses } from '../shared/interactions'
import { withPrefix } from '../shared/misc'
import { authorization } from '../shared/flow-crypto'

export const MINT_FLOW_CODE = `
import FungibleToken from 0xFUNGIBLETOKENADDRESS
import FlowToken from 0xTOKENADDRESS

transaction(recipient: Address, amount: UFix64) {
  let tokenAdmin: &FlowToken.Administrator
  let tokenReceiver: &{FungibleToken.Receiver}

  prepare(signer: AuthAccount) {
      self.tokenAdmin = signer
      .borrow<&FlowToken.Administrator>(from: /storage/flowTokenAdmin)
      ?? panic("Signer is not the token admin")

      self.tokenReceiver = getAccount(recipient)
      .getCapability(/public/flowTokenReceiver)!
      .borrow<&{FungibleToken.Receiver}>()
      ?? panic("Unable to borrow receiver reference")
  }

  execute {
      let minter <- self.tokenAdmin.createNewMinter(allowedAmount: amount)
      let mintedVault <- minter.mintTokens(amount: amount)

      self.tokenReceiver.deposit(from: <-mintedVault)

      destroy minter
  }
}
`

/**
 * Sends transaction to mint specified amount of FlowToken and send it to recipient.
 * Returns result of the transaction.
 * @param {string} admin - authorizing account
 * @param {string} recipient - recipient account
 * @param {string} amount - amount to mint and send
 * @returns {Promise<*>}
 */
export const mintFlow = async (
  admin: IFlowAccount,
  recipient: IFlowAccount,
  amount: string,
) => {
  const code = await replaceImportAddresses(MINT_FLOW_CODE)
  const args: Argument[] = [
    arg(withPrefix(recipient.address), t.Address),
    arg(amount, t.UFix64),
  ]
  const auth = authorization(admin)

  return sendTransaction({ code, args, auth })
}
