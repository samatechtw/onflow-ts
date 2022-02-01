import { InteractionType } from './enum-interaction-type'
import { ContractMap } from './contract-map'

export interface IInteraction {
  name: string
  addressMap?: ContractMap
  type: InteractionType.CONTRACT | InteractionType.TRANSACTION | InteractionType.SCRIPT
}
