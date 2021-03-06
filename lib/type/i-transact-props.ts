import { Argument } from '@onflow/fcl'
import { IFlowAccount } from './i-flow-account'

export interface ITransactProps {
  name: string
  auth?: IFlowAccount
  signers?: IFlowAccount[]
  args?: Argument[]
  waitForSealed?: boolean
}
