import { Argument, FclAuthorization } from '@samatech/onflow-fcl-esm'

export interface IInteractionProps {
  name?: string
  code: string
  args?: Argument[]
  auth?: FclAuthorization
  authorizations?: FclAuthorization[]
}
