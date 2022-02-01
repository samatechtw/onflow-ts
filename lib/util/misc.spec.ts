import { withPrefix } from './misc'

describe('util-flow', () => {
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
