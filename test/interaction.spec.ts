import 'isomorphic-fetch'
import { it, describe, jest } from '@jest/globals'
import { config } from '@onflow/config'
import { emulator, logFilter } from '../lib'

jest.setTimeout(5000)

describe('Emulator interactions', () => {
  const port = 7001

  it('starts and stops the emulator', async () => {
    const accessNode = `http://127.0.0.1:${port}`
    config().put('accessNode.api', accessNode)
    emulator.setLogFilter(logFilter)
    await emulator.start({
      restPort: port,
    })
    await emulator.stop()
  })
})
