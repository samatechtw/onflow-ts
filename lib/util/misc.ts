import { sansPrefix } from '@samatech/onflow-fcl-esm'

const UFIX64_PRECISION = 8

// UFix64 values shall be always passed as strings
export const toUFix64 = (value: number): string => value.toFixed(UFIX64_PRECISION)

export const withPrefix = (address?: string): string | undefined => {
  if (!address) return address
  return `0x${sansPrefix(address)}`
}
