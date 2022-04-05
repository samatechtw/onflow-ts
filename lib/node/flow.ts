import * as t from '@onflow/types'
import { arg, Argument } from '@samatech/onflow-fcl-esm'
import {
  authorization,
  executeScript,
  replaceImportAddresses,
  sendTransaction,
  withPrefix,
} from '../esm'
import { IFlowAccount, ITransactionInteractionProps } from '../type'

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

export const TRANSFER_FLOW_CODE = `
import FungibleToken from 0xFUNGIBLETOKENADDRESS
import FlowToken from 0xTOKENADDRESS

transaction(amount: UFix64, to: Address) {

    // The Vault resource that holds the tokens that are being transferred
    let sentVault: @FungibleToken.Vault

    prepare(signer: AuthAccount) {

        // Get a reference to the signer's stored vault
        let vaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
			?? panic("Could not borrow reference to the owner's Vault!")

        // Withdraw tokens from the signer's stored vault
        self.sentVault <- vaultRef.withdraw(amount: amount)
    }

    execute {

        // Get the recipient's public account object
        let recipient = getAccount(to)

        // Get a reference to the recipient's Receiver
        let receiverRef = recipient.getCapability(/public/flowTokenReceiver)
            .borrow<&{FungibleToken.Receiver}>()
			?? panic("Could not borrow receiver reference to the recipient's Vault")

        // Deposit the withdrawn tokens in the recipient's receiver
        receiverRef.deposit(from: <-self.sentVault)
    }
}
`

export const GET_FLOW_BALANCE_CODE = `
import FungibleToken from 0xFUNGIBLETOKENADDRESS
import FlowToken from 0xTOKENADDRESS

pub fun main(account: Address): UFix64 {

    let vaultRef = getAccount(account)
        .getCapability(/public/flowTokenBalance)
        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    return vaultRef.balance
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

/**
 * Transfer a specified amount of FlowToken to recipient.
 * Returns result of the transaction.
 * @param {string} sender - authorizing account
 * @param {string} to - recipient account
 * @param {string} amount - amount to transfer
 * @returns {Promise<*>}
 */
export const transferFlow = async (
  sender: IFlowAccount,
  to: IFlowAccount,
  amount: string,
  props?: Partial<ITransactionInteractionProps>,
) => {
  const code = await replaceImportAddresses(TRANSFER_FLOW_CODE)
  const args: Argument[] = [arg(amount, t.UFix64), arg(withPrefix(to.address), t.Address)]
  const auth = authorization(sender)

  return sendTransaction({ ...(props ?? {}), code, args, auth })
}

/**
 * Gets the amount of FlowToken owned by an account
 * Returns result of the transaction.
 * @param {string} address - account address
 * @returns {Promise<*>}
 */
export const getFlowBalanceCdc = async (address: string) => {
  const code = await replaceImportAddresses(GET_FLOW_BALANCE_CODE)
  const args: Argument[] = [arg(withPrefix(address), t.Address)]
  return executeScript({ code, args }) as unknown as string
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
