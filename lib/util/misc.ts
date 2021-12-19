import * as fcl from '@samatech/onflow-fcl-esm';

export interface FlowAccount {
  address: string;
  privateKey: string;
  keyId?: number;
}

const UFIX64_PRECISION = 8;

export interface FclWallet extends fcl.UserSnapshot {
  // Used for development/test signing
  key?: string;
  authorization?: fcl.FclAuthorization;
}

// UFix64 values shall be always passed as strings
export const toUFix64 = (value: number): string => value.toFixed(UFIX64_PRECISION);

export const withPrefix = (address?: string): string | undefined => {
  if (!address) return address;
  return `0x${fcl.sansPrefix(address)}`;
};

export const findEvent = (
  events: fcl.CadenceEvent[],
  eventType: string,
): fcl.CadenceEvent | undefined => {
  for (const event of events) {
    if (event.type.includes(eventType)) {
      return event;
    }
  }
  return undefined;
};
