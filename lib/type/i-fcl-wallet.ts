import { FclAuthorization, UserSnapshot } from '@onflow/fcl'

export interface IFclWallet extends UserSnapshot {
  // Used for development/test signing
  key?: string
  authorization?: FclAuthorization
}
