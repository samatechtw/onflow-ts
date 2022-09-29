export interface IFlowPublicKey {
  keyIndex: number
  publicKey: {
    publicKey: number[]
    signatureAlgorithm: { rawValue: number }
  }
  hashAlgorithm: { rawValue: number }
  weight: string
  isRevoked: boolean
}
