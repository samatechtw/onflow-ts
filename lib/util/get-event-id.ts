import { sansPrefix } from '@samatech/onflow-fcl-esm'

// Get event id
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
