import { Buffer } from 'buffer'
import { ec as EC } from 'elliptic'
import { SHA3 } from 'sha3'
import { Account, AuthZ, FclAuthorization, sansPrefix, SigningData } from '@onflow/fcl'
import { withPrefix } from '../../shared/misc'
import { IFlowAccount } from '../../type/i-flow-account'
import { ICompositeSignature } from '../../wallet'

const ec = new EC('p256')

export const hashMsgHex = (msgHex: string) => {
  const sha = new SHA3(256)
  sha.update(Buffer.from(msgHex, 'hex'))
  return sha.digest()
}

export const signWithKey = (privateKey: string, msgHex: string) => {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, 'hex'))
  const sig = key.sign(hashMsgHex(msgHex))
  const n = 32 // half of signature length?
  const r = sig.r.toArrayLike(Buffer, 'be', n)
  const s = sig.s.toArrayLike(Buffer, 'be', n)
  return Buffer.concat([r, s]).toString('hex')
}

export const authorizationMaybe = (
  flowAccount?: IFlowAccount,
): FclAuthorization | undefined => {
  if (flowAccount) {
    return authorization(flowAccount)
  }
  return undefined
}

export const authorization = (flowAccount: IFlowAccount): FclAuthorization => {
  return async (account: Account): Promise<AuthZ> => {
    const keyId = flowAccount.keyId || 0

    const addr = sansPrefix(flowAccount.address)

    const signingFunction = (data: SigningData): ICompositeSignature => {
      return {
        keyId,
        addr: withPrefix(addr) || '',
        signature: signWithKey(flowAccount.privateKey, data.message),
      }
    }

    return {
      ...account,
      tempId: `${addr}-${keyId}`,
      addr: sansPrefix(addr),
      keyId,
      signingFunction,
    }
  }
}
