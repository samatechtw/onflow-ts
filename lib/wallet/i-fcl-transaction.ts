import { InteractionType } from '../type'

interface IFclServiceParams {
  sessionId: string
}

interface IFclService {
  params: IFclServiceParams
}

export interface IFclConfig {
  app: object
  client: IFclClient
  services: object
}

export interface IFclClient {
  clientServices?: string[]
  discoveryAuthnInclude?: string[]
  fclLibrary: string
  fclVersion: string
  hostname: string
  supportedStrategies?: string[]
}

export interface IFclRoles {
  proposer: boolean
  payer: boolean
  authorizer: boolean
}

export interface IFclInteractionArg {
  type: string
  value: string
}

export interface IFclInteractionMessage {
  cadence: string
  refBlock: string
  computeLimit: number
  proposer: string | null
  payer: string | null
  authorizations: string[]
  params: string[]
  arguments: string[]
}

export interface IFclInteractionAccount {
  tempId: string
  addr: string
  keyId: number
  role: IFclRoles
  resolve: string | null
  sequenceNum?: number
}

export interface IFclRequestKey {
  address: string
  keyId: number
  sequenceNum?: number
}

interface IFclArgumentXform {
  label: string
}

export interface IFclInteractionArgument {
  kind: string
  tempId: string
  value: string
  asArgument: IFclInteractionArg
  xform: IFclArgumentXform
}

interface IFclInteractionEvents {
  eventType: string | null
  start: string | null
  end: null
  blockIds: string[]
}

interface IFclRequestTransaction {
  id: string | null
}

interface IFclRequestBlock {
  id: string | null
  height: string | null
  isSealed: boolean | null
}

export interface IFclInteraction {
  tag: InteractionType
  assigns: object
  status: string
  reason: string | null
  accounts: Record<string, IFclInteractionAccount>
  params: object
  arguments: Record<string, IFclInteractionArgument>
  message: IFclInteractionMessage
  proposer: string
  authorizations: string[]
  payer: string[]
  events: IFclInteractionEvents
  transaction: IFclRequestTransaction
  block: IFclRequestBlock
  account: object
  collection: object
}

export interface IFclVoucher {
  cadence: string
  refBlock: string
  computeLimit: number
  arguments: IFclInteractionArg[]
  proposalKey: IFclRequestKey
  payer: string
  authorizers: string[]
  payloadSigs: IFclRequestKey[]
  envelopeSigs: IFclRequestKey[]
}

export interface IFclTransaction {
  fclVersion: string
  service: IFclService
  config: IFclConfig
  f_type: string
  f_vsn: string
  message: string
  addr: string
  keyId: number
  roles: IFclRoles
  cadence: string
  args: IFclInteractionArg[]
  interaction: IFclInteraction
  voucher: IFclVoucher
}
