import { ChildProcess, spawn } from 'child_process'
import { build, decode, getBlock, send } from '@onflow/fcl'

const DEFAULT_HOST = '127.0.0.1'
const DEFAULT_HTTP_PORT = 7000
const DEFAULT_REST_PORT = 8888
const DEFAULT_GRPC_PORT = 3569

export type EmulatorLogFilter = (message: string) => string | undefined

type LogType = 'info' | 'warn' | 'error' | 'log'

export interface EmulatorOptions {
  logFilter?: EmulatorLogFilter
}

export interface EmulatorStartOptions {
  host?: string
  grpcPort?: number
  adminPort?: number
  restPort?: number
  accessNode?: string
  basePath?: string
}

/** Class representing emulator */
export class Emulator {
  logFilter?: EmulatorLogFilter
  startFailed: boolean
  process?: ChildProcess

  /**
   * Create an emulator.
   */
  constructor(options?: EmulatorOptions) {
    const resolvedOptions = options || {}
    this.logFilter = resolvedOptions.logFilter
    this.startFailed = false
  }

  /**
   * Set logging flag.
   * @param {boolean} logging - whether logs shall be printed
   */
  setLogFilter(logFilter: EmulatorLogFilter) {
    this.logFilter = logFilter
  }

  /**
   * Log message with a specific type.
   * @param {*} message - message to put into log output
   * @param {"log"|"error"} type - type of the message to output
   */
  log(message: string, bypassFilter = false, type: LogType = 'log') {
    if (bypassFilter || !this.logFilter) {
      console[type](message)
    } else {
      const filtered = this.logFilter(message)
      if (filtered !== undefined) {
        console[type](filtered)
      }
    }
  }

  /**
   * Start emulator.
   * @param {number} port - port to use for accessApi
   */
  start = async (options?: EmulatorStartOptions): Promise<boolean> => {
    const admin = options?.adminPort ?? DEFAULT_HTTP_PORT
    const rest = options?.restPort ?? DEFAULT_REST_PORT
    const grpc = options?.grpcPort ?? DEFAULT_GRPC_PORT
    const host = options?.host ?? DEFAULT_HOST

    this.process = spawn('flow', [
      'emulator',
      '-v',
      '--admin-port',
      admin.toString(),
      '--rest-port',
      rest.toString(),
      '--host',
      host,
      '--port',
      grpc.toString(),
    ])
    if (!this.process || !this.process.stdin || !this.process.stdout) {
      throw new Error('Emulator failed to start')
    }

    return new Promise((resolve, reject) => {
      const checkLiveness = async function () {
        try {
          await send(build([getBlock(false)])).then(decode)

          clearInterval(waitReadyTimeout)
          resolve(true)
        } catch (err) {
          console.log('Flow emulator not ready yet')
        }
      }
      let waitReadyTimeout: NodeJS.Timeout | undefined

      this.process?.stdout?.on('data', (data) => {
        if (data.includes('Starting admin server')) {
          this.log(data.toString())
          this.log('EMULATOR IS UP! Listening for events!', true)
          waitReadyTimeout = setInterval(checkLiveness, 100)
        } else if (data.includes('Server stopped')) {
          clearInterval(waitReadyTimeout)
          this.log(data.toString())
          this.log('Emulator closed', true)
          this.process = undefined
          reject('Emulator closed, check logs for reason')
        } else {
          this.log(data.toString())
        }
      })

      this.process?.stderr?.on('data', (data) => {
        clearInterval(waitReadyTimeout)
        this.log(`ERROR: ${data}`, true, 'error')
        this.startFailed = true
        this.process?.kill()
      })

      this.process?.on('close', (code) => {
        if (this.startFailed) {
          clearInterval(waitReadyTimeout)
          this.log(`emulator closed with code ${code}`, true)
          this.process = undefined
          reject()
        }
      })
    })
  }

  waitForClose = (): Promise<void> => {
    return new Promise((resolve) => {
      this.process?.on('close', (_code) => {
        console.log('CLOSED', _code)
        resolve()
      })
    })
  }

  stop = (): Promise<string> => {
    return new Promise((resolve, _reject) => {
      if (this.process) {
        this.process.on('exit', (code) => {
          this.process = undefined
          resolve(`Emulator stopped with code ${code}`)
        })
        this.process.kill('SIGKILL')
      }
    })
  }
}

export const emulator = new Emulator()
