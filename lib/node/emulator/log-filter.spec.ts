import { jest } from '@jest/globals'
import pc from 'picocolors'
import { logFilter } from './log-filter'

jest.mock('picocolors', () => ({
  green: jest.fn(),
}))
const mockedPc = pc as jest.Mocked<typeof pc>

describe('emulator log-filter', () => {
  it('returns undefined if filter not matched', () => {
    const result = logFilter('A log line that does not match the filter')
    expect(result).toBeUndefined()
  })

  it('returns undefined if cannot find a matching event', () => {
    mockedPc.green.mockReturnValueOnce('test-blue')
    const log = 'LOG: test log'
    const result = logFilter(`.....${log}\\"`)
    expect(result).toBeTruthy()

    expect(pc.green).toHaveBeenCalledWith(log)
  })
})
