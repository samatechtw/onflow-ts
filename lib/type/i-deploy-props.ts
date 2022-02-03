import { Argument } from '@onflow/types'
import { IFlowAccount } from './i-flow-account'

export interface IDeployProps {
  auth: IFlowAccount
  name: string
  to?: string
  args?: Argument[]
  update?: boolean
}
