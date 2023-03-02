import fs from 'fs'
import path from 'path'
import * as fcl from '@onflow/fcl'
import { config } from '@onflow/config'

import { getTemplate } from '../shared/code'
import { getAddressMap } from '../shared/config'
import { withPrefix } from '../shared/misc'
import { InteractionType, IDeployProps, IInteraction, ITransactProps } from '../type'
import { executeScript, sendTransaction, deployContract } from '../shared/interactions'
import { authorization, authorizationMaybe } from './util/flow-crypto'

export const defaultCdcDirectories = {
  [InteractionType.CONTRACT]: './contracts/',
  [InteractionType.TRANSACTION]: './transactions/',
  [InteractionType.SCRIPT]: './scripts/',
}

// Gets a Cadence file. Attempts to fall back on builtins if not found
export const getCadenceFile = async (
  name: string,
  type: InteractionType,
): Promise<string> => {
  const configBase = await config().get('BASE_PATH')
  const customCdcDirectories = await config().get('CDC_DIRECTORIES')
  if (!configBase) {
    throw new ReferenceError('BASE_PATH not set.')
  }
  const cdcDirectories = {
    ...defaultCdcDirectories,
    ...(customCdcDirectories || {}),
  }
  // Directory where Cadence contracts, transactions, or scripts reside
  const directory = cdcDirectories[type]
  const subPath = `${directory}/${name}.cdc`
  // Try to get path from application
  const userPath = path.resolve(configBase, subPath)
  if (fs.existsSync(userPath)) {
    return fs.readFileSync(userPath, 'utf8')
  }
  // Fall back on builtin Cadence files
  const builtinPath = path.resolve(__dirname, '../cadence', subPath)
  return fs.readFileSync(builtinPath, 'utf8')
}

/**
 * Returns a Cadence code template based on the name and the interaction type.
 * For example, for the give name = 'get_count' and type = 'SCRIPT' this function will
 * search for the `get_count.cdc` file located in the folder where all Cadence scripts are
 * residing.
 * @param name - name of the template in the corresponding interaction type folder.
 * @param type - type of interaction. It can be either CONTRACT, TRANSACTION or SCRIPT.
 * @returns {Promise<string>}
 */
const getCadenceCode = async ({ name, type }: IInteraction): Promise<string> => {
  const cadence = await getCadenceFile(name, type)
  const addressMap = getAddressMap()
  return getTemplate(cadence, addressMap)
}

export const transact = async (props: ITransactProps): Promise<fcl.CadenceResult> => {
  const { name, auth, signers, args, waitForSealed } = props

  let resolvedSigners
  if (signers) {
    resolvedSigners = signers
  } else if (auth) {
    resolvedSigners = [auth]
  } else {
    throw new Error('transact missing authorization')
  }

  const code = await getCadenceCode({
    name,
    type: InteractionType.TRANSACTION,
  })

  return sendTransaction({
    code,
    args,
    auth: authorizationMaybe(auth),
    authorizations: resolvedSigners.map((signer) => authorization(signer)),
    waitForSealed,
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const execute = async (name: string, args?: fcl.Argument[]): Promise<any> => {
  const code = await getCadenceCode({
    name,
    type: InteractionType.SCRIPT,
  })
  return executeScript({ args, code })
}

/**
 * Deploys contract as Cadence code to specified account
 * Returns transaction result.
 * @param props - Deploy properties
 */
export const deploy = async (props: IDeployProps) => {
  const { auth, name, args, update, to } = props

  const resolvedTo = withPrefix(to || auth.address)
  if (!resolvedTo) {
    throw new Error('Unable to resolve contract deploy address')
  }
  const code = await getCadenceCode({
    name,
    type: InteractionType.CONTRACT,
  })
  return deployContract({
    name,
    hexCode: hexContract(code),
    args,
    update,
    auth: authorization(auth),
    to: resolvedTo,
  })
}

export const hexContract = (contract: string) =>
  Buffer.from(contract, 'utf8').toString('hex')
