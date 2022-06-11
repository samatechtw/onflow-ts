import { AnyJson, IJsonObject } from '@onflow/fcl'
import { ContractMap } from '../type/contract-map'

/**
 * Address map with access by name for contracts deployed by default.
 * Pre-filled values are emulator contract addresses
 */
export const defaultsByName: ContractMap = {
  FlowToken: '0x0ae53cb6e3f42a79',
  FungibleToken: '0xee82856bf20e2aa6',
  FlowFees: '0xe5a8b7f23e8b548f',
  FlowStorageFees: '0xf8d6e0586b0a20c7',
}

let contractsMap: ContractMap = {}

/**
 * Returns the full contract address map object.
 * @returns {ContractMap} the full contact map that includes default and custom addresses
 */
export const getAddressMap = (): ContractMap => {
  return {
    ...defaultsByName,
    ...contractsMap,
  }
}

/**
 * Sets the custom contracts map without affecting the defaults
 * @param {ContractMap} contracts - the custom contracts map
 */
export const setAddressMap = (contracts: ContractMap): void => {
  contractsMap = contracts
}

/**
 * Returns a specific contract address based on the key name.
 * @param {string} key - the contract name
 * @returns {string|undefined} either a contract address if found or undefined
 */
export const getContractAddress = (key: string): string | undefined => {
  return getAddressMap()[key]
}

/**
 * Adds a new contract name/address pair to the contracts map
 * @param {string} name - new contract name
 * @param {string} address - new contract address
 */
export const setContractAddress = (name: string, address: string): void => {
  contractsMap[name] = address
}

/**
 * Get value from provided scope and path.
 * @param scope - scope value.
 * @param {string} path - path of value in flow.json
 * @returns {string|undefined} either a config value if found or undefined
 */
export const flowConfigGet = (flowConfig: AnyJson, path: string): string | undefined => {
  return configGet(flowConfig, path, '') || undefined
}

/**
 * Get value from provided scope and path.
 * @param scope - scope value.
 * @param {string} path - path of value in flow.json
 * @param fallback - fallback value.
 * @returns {string|undefined} either a config value if found or a fallback value
 */
export const configGet = (scope: AnyJson, path: string, fallback: string): string => {
  const pathArr = path.split('/')
  let obj = scope
  for (const pathKey of pathArr) {
    if (typeof obj !== 'object') {
      break
    }
    obj = (obj as IJsonObject)[pathKey]
  }
  if (!obj || typeof obj !== 'string') {
    console.warn(`Config "${path}" not found, fallback="${fallback}"`)
    return fallback
  }
  return obj
}
