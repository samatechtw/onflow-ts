import { sansPrefix } from '@samatech/onflow-fcl-esm'

const UFIX64_PRECISION = 8

/**
 * Returns a string representation of the 64-bit unsigned fixed number
 * It's always represented with 8 decimal places
 * @param {number} value - a number to be converted to UFix64 string format
 * @returns {string} a string in the UFix64 format
 */
export const toUFix64 = (value: number): string => value.toFixed(UFIX64_PRECISION)

/**
 * Adds a hexadecimal prefix if one does not exist
 * @param {string} address - an address to add a hexadecimal prefix to
 * @returns {string} either an address with hexadecimal prefix or undefined value
 * if the passed in address is undefined
 */
export const withPrefix = (address?: string): string | undefined => {
  if (!address) return address
  return `0x${sansPrefix(address)}`
}
