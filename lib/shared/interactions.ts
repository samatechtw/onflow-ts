import * as fcl from '@samatech/onflow-fcl-esm'
import * as t from '@onflow/types'
import { getTemplate, extractImports } from './code'
import { defaultsByName, getContractAddress } from './config'

import { ContractMap } from '../type/contract-map'
import { setContractAddress } from './config'
import {
  IDeployInteractionProps,
  IInteractionProps,
  ITransactionInteractionProps,
} from '../type'

/**
 * Resolves import addresses defined in code template
 * @param {string} code - Cadence template code.
 */
export const resolveImports = async (code: string) => {
  const addressMap: ContractMap = {}
  const importList = extractImports(code)
  for (const key in importList) {
    const address = getContractAddress(key)
    if (address) {
      addressMap[key] = address
    } else {
      console.error('resolveImports - could not find contract address', key)
    }
  }
  return addressMap
}

/**
 * Returns Cadence template code with replaced import addresses
 * @param {string} code - Cadence template code.
 * @returns {*}
 */
export const replaceImportAddresses = async (code: string): Promise<string> => {
  const deployedContracts = await resolveImports(code)

  const addressMap = {
    ...defaultsByName,
    ...deployedContracts,
  }
  return getTemplate(code, addressMap)
}

export const executeScript = async (
  props: IInteractionProps,
): Promise<fcl.CadenceResult> => {
  const { code, args } = props

  if (!code) {
    throw Error('executeScript `code` is missing.')
  }
  const ixCode = await replaceImportAddresses(code)

  const ix: [unknown] = [fcl.script(ixCode)]
  // add arguments if any
  if (args) {
    ix.push(fcl.args(args))
  }

  const response = await fcl.send(ix)

  return fcl.decode(response)
}

/**
 * Submits transaction to the current network network and waits for it to be sealed.
 * Returns transaction result.
 * @param {string} [props.name] - Name of Cadence template file
 * @param {string} [props.code] - Cadence code of the transaction.
 * @param {[any]} props.args - argument tuple. the last value is the type of preceding values.
 * @param {[FclAuthorization]} [props.authorizations] - optional array of authorizations
 * @param {FclAuthorization} [props.auth]  - transaction payer
 */
export const sendTransaction = async (
  props: ITransactionInteractionProps,
): Promise<fcl.CadenceResult> => {
  const { name, code, args, authorizations, auth, waitForSealed } = props
  const waitSealed = !!waitForSealed

  if (!name && !code) {
    throw Error('Both `name` and `code` are missing. Provide either of them')
  }

  const ixCode = await replaceImportAddresses(code)

  const payer = auth || (authorizations || [])[0]

  if (!payer) {
    throw new Error('sendTransaction requires at least one authorization')
  }

  // set repeating transaction code
  const ix = [
    fcl.transaction(ixCode),
    fcl.payer(payer),
    fcl.proposer(payer),
    fcl.limit(9999),
  ]

  if (authorizations) {
    ix.push(fcl.authorizations(authorizations))
  } else {
    ix.push(fcl.authorizations([payer]))
  }
  // add arguments if any
  if (args) {
    ix.push(fcl.args(args))
  }
  const response = await fcl.send(ix)
  let transaction
  if (waitSealed) {
    transaction = await fcl.tx(response).onceSealed()
  } else {
    transaction = fcl.tx(response)
  }
  return {
    transactionId: response.transactionId,
    ...transaction,
  }
}

/**
 * Submits deploy transaction to the current network and waits for it to be sealed.
 * Returns transaction result.
 * @param {string} [props.name] - Name of Cadence template file
 * @param {string} [props.hexCode] - Cadence code of the transaction in hex format
 * @param {[any]} [props.args] - argument tuple. the last value is the type of preceding values.
 * @param {boolean} [props.update] - If true, update a contract. If false, deploy it.
 * @param {FclAuthorization} [props.auth]  - transaction payer
 * @param {string} [props.to] - Address to deploy the transaction to
 */
export const deployContract = async (
  props: IDeployInteractionProps,
): Promise<fcl.CadenceResult> => {
  const { name, hexCode, args, update, auth, to } = props

  if (!name) {
    throw new Error('deployTransaction requires a name')
  }

  let transactionCode = update ? UPDATE_CODE : DEPLOY_CODE

  let deployArgs: fcl.Argument[] = [fcl.arg(name, t.String), fcl.arg(hexCode, t.String)]

  // We don't really care about arg names, but each must be unique
  const argLetter = 'abcdefghijklmnopqrstuvwxyz'
  if (args) {
    deployArgs = deployArgs.concat(args)

    const argsList: string[] = []
    const argsWithTypes: string[] = []
    let i = 0
    for (const a of args) {
      const argName = argLetter[i]
      argsList.push(argName)

      const argWithName = `${argName}:${a.xform.label}`
      i += 1
      argsList.push(argWithName)
    }

    transactionCode = transactionCode.replace('##ARGS-WITH-TYPES##', `, ${argsWithTypes}`)
    transactionCode = transactionCode.replace('##ARGS-LIST##', argsList.toString())
  } else {
    transactionCode = transactionCode.replace('##ARGS-WITH-TYPES##', '')
    transactionCode = transactionCode.replace('##ARGS-LIST##', '')
  }

  const result = await sendTransaction({
    code: transactionCode,
    args: deployArgs,
    auth,
  })
  setContractAddress(name, to)
  return result
}

const UPDATE_CODE = `

transaction(name:String, code: String ##ARGS-WITH-TYPES##) {
  prepare(acct: AuthAccount){
      let decoded = code.decodeHex()

      if acct.contracts.get(name: name) == nil {
        acct.contracts.add(name: name, code: decoded)
      } else {
        acct.contracts.update__experimental(name: name, code: decoded)
      }
  }
}

`

const DEPLOY_CODE = `

transaction(name:String, code: String, ##ARGS-WITH-TYPES##) {
  prepare(acct: AuthAccount){
      let decoded = code.decodeHex()
      acct.contracts.add(
         name: name,
         code: decoded,
         ##ARGS-LIST##
      )
  }
}
`
