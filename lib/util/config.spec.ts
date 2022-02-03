import { AnyJson } from '@samatech/onflow-fcl-esm'
import { ContractMap } from '../type/contract-map'
import {
  getAddressMap,
  setAddressMap,
  getContractAddress,
  setContractAddress,
  configGet,
  flowConfigGet,
} from './config'

console.warn = jest.fn()

const flowJson: AnyJson = {
  emulators: { default: { port: 3569, serviceAccount: 'emulator-account' } },
  accounts: {
    'emulator-account': {
      address: '01cf0e2f2f715450',
      key: 'key',
      pubKey: 'pubKey',
    },
  },
  contracts: {
    NonFungibleToken: {
      source: './NonFungibleToken.cdc',
      aliases: {
        emulator: '0xf8d6e0586b0a20c7',
        testnet: '0x631e88ae7f1d7c20',
      },
    },
  },
  networks: {
    emulator: '127.0.0.1:3569',
    testnet: 'access.devnet.nodes.onflow.org:9000',
  },
}

const addressMap: ContractMap = {
  FlowToken: '0x0ae53cb6e3f42a79',
  FungibleToken: '0xee82856bf20e2aa6',
  FlowFees: '0xe5a8b7f23e8b548f',
  FlowStorageFees: '0xf8d6e0586b0a20c7',
}

const newContractName = 'SomeContract'
const newContractAddress = '0xe2c5a5f23e8b743c'

const getAddressMapWithNewContract = (): ContractMap => {
  return {
    ...getAddressMap(),
    ...{ [newContractName]: newContractAddress },
  }
}

describe('config', () => {
  describe('getAddressMap', () => {
    beforeEach(() => {
      setAddressMap({})
    })

    it('returns the address map', () => {
      expect(getAddressMap()).toEqual(addressMap)
    })

    it('returns the address map with the new contract', () => {
      setContractAddress(newContractName, newContractAddress)
      expect(getAddressMap()).toMatchObject(getAddressMapWithNewContract())
    })
  })

  describe('setAddressMap', () => {
    beforeEach(() => {
      setAddressMap({})
    })

    it('set address map without affecting defaults', () => {
      setAddressMap({ [newContractName]: newContractAddress })
      expect(getAddressMap()).toMatchObject(getAddressMapWithNewContract())
    })
  })

  describe('getContractAddress', () => {
    beforeEach(() => {
      setAddressMap({})
    })

    it('returns a specific contract address', () => {
      expect(getContractAddress('FlowToken')).toEqual(addressMap.FlowToken)
    })

    it('returns undefined if contract name does not exist', () => {
      expect(getContractAddress('BogusContractName')).toEqual(undefined)
    })
  })

  describe('setContractAddress', () => {
    beforeEach(() => {
      setAddressMap({})
    })

    it('adds a new contract name/address pair to the contracts map', () => {
      setContractAddress(newContractName, newContractAddress)
      expect(getContractAddress(newContractName)).toEqual(newContractAddress)
    })
  })

  describe('flowConfigGet', () => {
    it('returns configuration value for the given path', () => {
      const path = 'accounts/emulator-account/address'
      expect(flowConfigGet(flowJson, path)).toBe('01cf0e2f2f715450')
    })

    it('returns undefined if found configuration value is not a string', () => {
      const path = 'accounts/emulator-account'
      expect(flowConfigGet(flowJson, path)).toBe(undefined)
      expect(console.warn).toHaveBeenCalledWith(
        'Config "accounts/emulator-account" not found, fallback=""',
      )
    })

    it('returns undefined if path does not exist', () => {
      expect(flowConfigGet(flowJson, 'bogus/path')).toBe(undefined)
      expect(console.warn).toHaveBeenCalledWith(
        'Config "bogus/path" not found, fallback=""',
      )
    })
  })

  describe('configGet', () => {
    it('returns the configuration value for the given path', () => {
      const path = 'contracts/NonFungibleToken/source'
      expect(configGet(flowJson, path, 'fallback')).toBe('./NonFungibleToken.cdc')
    })

    it('returns a fallback value if given path not found', () => {
      expect(configGet(flowJson, 'bogus/path', 'fallback')).toBe('fallback')
    })
  })
})
