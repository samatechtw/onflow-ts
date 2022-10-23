export interface IAccountProofData {
  // A human readable string to identify your application during signing
  appIdentifier: string
  // Minimum 32-byte random nonce as hex string
  nonce: string
}

export type AccountProofDataResolver = () => Promise<IAccountProofData | null>
