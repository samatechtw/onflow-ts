import { toUFix64, withPrefix } from './misc'

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
})
