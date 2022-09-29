import { expect } from '@jest/globals'
import { CadenceResult } from '@onflow/fcl'

export const shallPass = async (interaction: Promise<CadenceResult>) => {
  await expect(interaction).resolves.not.toBe(null)
  await expect(interaction).resolves.not.toThrow()

  const { status, errorMessage } = await interaction
  expect(status).toBe(4)
  expect(errorMessage).toBe('')

  return interaction
}

export const shallResolve = async (interaction: Promise<CadenceResult>) => {
  await expect(interaction).resolves.not.toThrow()

  return await interaction
}

export const shallRevert = async (interaction: Promise<CadenceResult>) => {
  await expect(interaction).rejects.not.toBe(null)
  return await interaction
}

export const shallThrow = async (interaction: Promise<CadenceResult>) => {
  expect(interaction).rejects.not.toBe(null)
  expect(interaction).rejects.toThrow()
  return await interaction
}
