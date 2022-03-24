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

/**
 * Parses a string representation of the USD amount into a number
 * @param amount string representation of the USD amount
 * @returns USD amount as a number
 */
export function usdToCents(amount: string): number {
  return Math.round(
    100 * parseFloat(typeof amount === 'string' ? amount.replace(/[$,]/g, '') : amount),
  )
}

/**
 * Converts USD cents to dollar amount
 * Example: usdCentsToDollars(5575) => $55.75
 * @param cents amount to convert to USD
 * @returns amount in USD
 */
export function usdCentsToDollars(cents: number): string {
  return formatUsd(cents / 100)
}

/**
 * Formats the dollar amount into USD amount prepended with a $ symbol
 * @param dollars amount in USD
 * @param showZeroCents if true then a whole number will be padded with two 0s as decimals
 * @returns formatted USD value prepended with a $ symbol
 */
export function formatUsd(dollars: number, showZeroCents?: boolean): string {
  const formatted = dollars.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  const split = formatted.split('.')
  if (!showZeroCents && split.length >= 2 && split[split.length - 1] === '00') {
    return split[0]
  }
  return formatted
}
