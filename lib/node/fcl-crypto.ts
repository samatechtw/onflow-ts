import { IFlowAccount } from '../type'
import { deploy } from './interactions'

/*
 * Deploys FCLCrypto contract to the account
 * @param {IFlowAccount} account - the account to deploy the FCLCrypto contract on
 * @throws If execution is halted
 * @returns {Promise<*>}
 * */
export const deployFclCrypto = async (account: IFlowAccount) => {
  await deploy({ name: 'FCLCrypto', auth: account })
}
