import * as rlp from 'rlp'
import * as t from '@onflow/types'
import { arg, CadenceResult } from '@onflow/fcl'
import { flowConfig } from '@onflow/fcl-config'
import { ec as EC } from 'elliptic'
import { AnyJson } from '@onflow/fcl'
import { IFlowAccount } from '../../type'
import { fromHex, toHex, withPrefix } from '../../shared/misc'
import { flowConfigGet } from '../../shared/config'
import { sendTransaction } from '../../shared/interactions'
import { authorization } from '../util/flow-crypto'

const ec = new EC('p256')

// TODO -- move this to @samatech/onflow-ts

export const CREATE_ACCOUNT_CODE = `
transaction (_ pubKey: String) {
    prepare( admin: AuthAccount) {
        let newAccount = AuthAccount(payer:admin)
        newAccount.addPublicKey(pubKey.decodeHex())
    }
}
`

export const ADD_KEY_CODE = `
transaction(_ pubKey: String) {
	  prepare(signer: AuthAccount) {
		    signer.addPublicKey(pubKey.decodeHex())
	  }
}
`

export const formatPubKey = (
  pubKey: string,
  signatureAlgorithm = 2, // P256
  hashAlgorithm = 3, // SHA3-256
): string => {
  return toHex(
    rlp.encode([
      fromHex(pubKey), // publicKey hex to binary
      signatureAlgorithm,
      hashAlgorithm,
      1000, // give key full weight
    ]),
  )
}

// Currently unused, we create accounts offline and use public keys from flow.json
export const pubFlowKey = async (privateKey: string): Promise<string> => {
  const keys = ec.keyFromPrivate(Buffer.from(privateKey), 'hex')
  const publicKey = keys.getPublic('hex').replace(/^04/, '')
  return formatPubKey(publicKey)
}

export const createKeyPair = () => {
  const key = ec.genKeyPair()
  return {
    privateKey: key.getPrivate('hex'),
    publicKey: key.getPublic('hex').replace(/^04/, ''),
  }
}

export const createFlowAccount = async (
  auth: IFlowAccount,
  publicKey: string,
): Promise<CadenceResult> => {
  const args = [arg(formatPubKey(publicKey), t.String)]
  return await sendTransaction({
    code: CREATE_ACCOUNT_CODE,
    args,
    auth: authorization(auth),
  })
}

export class AccountManager {
  accounts: Record<string, IFlowAccount> = {}
  flowConfigObj: AnyJson = flowConfig()

  register(path: string): IFlowAccount {
    const address = withPrefix(flowConfigGet(this.flowConfigObj, `${path}/address`))
    const privateKey = flowConfigGet(this.flowConfigObj, `${path}/key`)
    if (!address || !privateKey) {
      throw new Error(`No address/key found in ${path}`)
    }
    this.accounts[address] = {
      address,
      privateKey,
    }
    return this.accounts[address]
  }

  async create(auth: IFlowAccount, path: string): Promise<IFlowAccount> {
    const address = withPrefix(flowConfigGet(this.flowConfigObj, `${path}/address`))
    const privateKey = flowConfigGet(this.flowConfigObj, `${path}/key`)
    const publicKey = flowConfigGet(this.flowConfigObj, `${path}/pubKey`)
    if (!address || !privateKey || !publicKey) {
      throw new Error(`No address/key/pubKey found in ${path}`)
    }
    await createFlowAccount(auth, publicKey)

    this.accounts[address] = {
      address,
      privateKey,
    }
    return this.accounts[address]
  }

  async addKey(auth: IFlowAccount, path: string): Promise<IFlowAccount> {
    const publicKey = flowConfigGet(this.flowConfigObj, `${path}/pubKey`)
    if (!publicKey) {
      throw new Error(`No address/key/pubKey found in ${path}`)
    }

    const args = [arg(formatPubKey(publicKey), t.String)]
    await sendTransaction({
      code: ADD_KEY_CODE,
      args,
      auth: authorization(auth),
    })
    return auth
  }

  get(address: string): IFlowAccount {
    const account = this.accounts[address]
    if (!account) {
      throw new Error(`No account found for ${address}`)
    }
    return account
  }
}
