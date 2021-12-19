import { ContractMap } from './code';

/**
 * Address map with access by name for contracts deployed by default.
 * Pre-filled values are emulator contract addresses
 */
export const defaultsByName: ContractMap = {
  FlowToken: '0x0ae53cb6e3f42a79',
  FungibleToken: '0xee82856bf20e2aa6',
  FlowFees: '0xe5a8b7f23e8b548f',
  FlowStorageFees: '0xf8d6e0586b0a20c7',
};

const contractsMap: ContractMap = {};

export const setContractAddress = (name: string, address: string): void => {
  contractsMap[name] = address;
};

export const getAddressMap = (): ContractMap => {
  return {
    ...defaultsByName,
    ...contractsMap,
  };
};

export const getContractAddress = (key: string): string | undefined => {
  return getAddressMap()[key];
};
