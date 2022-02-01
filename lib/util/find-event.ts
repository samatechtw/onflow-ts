import { CadenceEvent } from '@samatech/onflow-fcl-esm'

export const findEvent = (
  events: CadenceEvent[],
  eventType: string,
): CadenceEvent | undefined => {
  for (const event of events) {
    if (event.type.includes(eventType)) {
      return event
    }
  }
  return undefined
}
