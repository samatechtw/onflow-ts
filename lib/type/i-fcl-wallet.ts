import { FclAuthorization, UserSnapshot } from '@samatech/onflow-fcl-esm'

export interface IFclWallet extends UserSnapshot {
  // Used for development/test signing
  key?: string
  authorization?: FclAuthorization
}
