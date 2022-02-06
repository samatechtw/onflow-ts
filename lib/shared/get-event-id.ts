import { sansPrefix } from '@samatech/onflow-fcl-esm'

/**
 * Returns a full event id based on provided parameters
 * @param {string} contractAddress - the contract address
 * @param {string} contractName - the contract name
 * @param {string} eventName - the event name
 * @param {string} [eventPrefix='A'] - an event prefix
 * @returns {string} returns the full event id
 */
export const getEventId = (
  contractAddress: string,
  contractName: string,
  eventName: string,
  eventPrefix = 'A',
): string => {
  const address = contractAddress.startsWith('0x')
    ? sansPrefix(contractAddress)
    : contractAddress
  return `${eventPrefix}.${sansPrefix(address)}.${contractName}.${eventName}`
}
