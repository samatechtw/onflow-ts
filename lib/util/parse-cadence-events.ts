import { CadenceEvent } from '@samatech/onflow-fcl-esm'
import { findEvent } from './find-event'
import { IFlowPurchaseEvent } from '../type/i-flow-purchase-event'

export const purchaseFromEvents = (
  events?: CadenceEvent[],
): IFlowPurchaseEvent | undefined => {
  const eventType = 'NFTStorefront.Purchase'

  const event = findEvent(events ?? [], eventType)

  const eventData = event?.data
  if (
    !eventData ||
    eventData.blueprintId === undefined ||
    eventData.sold === undefined ||
    eventData.soldOut === undefined
  ) {
    return undefined
  }

  return {
    flowBlueprintId: eventData.blueprintId as number,
    sold: eventData.sold as number,
    soldOut: eventData.soldOut as boolean,
  }
}
