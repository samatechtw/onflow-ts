import { Argument, FclAuthorization } from '@samatech/onflow-fcl-esm'

export interface IInteractionProps {
  name?: string
  code: string
  args?: Argument[]
  auth?: FclAuthorization
  authorizations?: FclAuthorization[]
}

export interface IDeployInteractionProps
  extends Omit<IInteractionProps, 'auth' | 'code'> {
  update?: boolean
  to: string
  auth: FclAuthorization
  hexCode: string
}
