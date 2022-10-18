import { config } from '@onflow/config'
import path from 'path'
import { emulator, EmulatorStartOptions } from './emulator'
import { logFilter } from './log-filter'

export const testSetup = async (options: EmulatorStartOptions) => {
  const port = options.grpcPort ?? options.restPort
  emulator.setLogFilter(logFilter)
  const basePath = options.basePath ?? '../../cadence'
  config().put('BASE_PATH', path.resolve(basePath))
  config().put('accessNode.api', options.accessNode ?? `http://localhost:${port}`)
  const restPort = options.restPort || 8888
  const grpcPort = options.grpcPort || 3569
  await emulator.start({
    adminPort: 6999,
    grpcPort,
    restPort,
    host: options.host,
  })
  console.log(`Emulator started: restPort=${restPort}, grpcPort=${grpcPort}`)
  return emulator
}
