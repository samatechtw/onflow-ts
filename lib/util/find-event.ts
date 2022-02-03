import { CadenceEvent } from '@samatech/onflow-fcl-esm'

/**
 * Returns an event for the given type
 * @param {CadenceEvent[]} events - events where to search
 * @param {string} eventType - the type of the event to search for
 * @returns {CadenceEvent|undefined} returns the event if found; otherwise - undefined
 */
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
