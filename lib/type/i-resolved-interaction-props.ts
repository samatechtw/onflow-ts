import { Argument, FclAuthorization } from '@samatech/onflow-fcl-esm'

export interface ResolvedInteractionProps {
  name: string
  auth?: FclAuthorization
  authorizations?: FclAuthorization[]
  args?: Argument[]
  code: string
}
