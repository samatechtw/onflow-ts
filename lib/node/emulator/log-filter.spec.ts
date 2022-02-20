import chalk from 'chalk'
import { logFilter } from './log-filter'

jest.mock('chalk', () => ({
  green: jest.fn(),
}))
const mockedChalk = chalk as jest.Mocked<typeof chalk>

describe('emulator log-filter', () => {
  it('returns undefined if filter not matched', () => {
    const result = logFilter('A log line that does not match the filter')
    expect(result).toBeUndefined()
  })

  it('returns undefined if cannot find a matching event', () => {
    mockedChalk.green.mockReturnValueOnce('test-blue')
    const log = 'LOG: test log'
    const result = logFilter(`.....${log}\\"`)
    expect(result).toBeTruthy()

    expect(chalk.green).toHaveBeenCalledWith(log)
  })
})
