import { toUFix64, withPrefix, usdToCents, usdCentsToDollars, formatUsd } from './misc'

describe('util-flow', () => {
  describe('toUFix64', () => {
    it('returns a string representation of a UFix64 integer (8 decimal places)', () => {
      expect(toUFix64(12)).toBe(`12.00000000`)
    })

    it('returns a string representation of a UFix64 float (8 decimal places)', () => {
      expect(toUFix64(12.12345678)).toBe(`12.12345678`)
    })
  })

  describe('withPrefix', () => {
    it('returns address with prefix if no prefix is found', () => {
      const address = '0ae53cb6e3f42a79'
      expect(withPrefix(address)).toBe(`0x${address}`)
    })

    it('returns address as is if prefix already exists', () => {
      const address = '0x0ae53cb6e3f42a79'
      expect(withPrefix(address)).toBe(address)
    })
  })

  describe('usdToCents', () => {
    it.each([
      ['0.00000000', 0],
      ['300.00000000', 30000],
      ['300.99000000', 30099],
      ['1.01', 101],
      ['10.001', 1000],
      ['$199.99', 19999],
    ])('converts %i dollars to %s cents', (amount, expected) => {
      expect(usdToCents(amount)).toEqual(expected)
    })
  })

  describe('usdCentsToDollars', () => {
    it.each([
      [0, '$0'],
      [10, '$0.10'],
      [100, '$1'],
      [1000, '$10'],
      [1000000, '$10,000'],
    ])('converts %i cents to %s dollars', (cents, expected) => {
      expect(usdCentsToDollars(cents)).toEqual(expected)
    })
  })

  describe('formatUsd', () => {
    it.each([
      [0, false, '$0'],
      [0, true, '$0.00'],
      [10, false, '$10'],
      [100, true, '$100.00'],
      [100.5, true, '$100.50'],
      [1000.75, false, '$1,000.75'],
      [1000000.2, false, '$1,000,000.20'],
    ])(
      `converts %i cents (show zero cents: %s) %s dollars`,
      (cents, showZeroCents, expected) => {
        expect(formatUsd(cents, showZeroCents)).toEqual(expected)
      },
    )
  })
})
