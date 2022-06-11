import { Argument, FclAuthorization } from '@onflow/fcl'

export interface ResolvedInteractionProps {
  name: string
  auth?: FclAuthorization
  authorizations?: FclAuthorization[]
  args?: Argument[]
  code: string
}
