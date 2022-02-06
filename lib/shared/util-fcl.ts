import {
  BlockObject,
  build,
  CadenceEvent,
  decode,
  getBlock,
  getEventsAtBlockHeightRange,
  send,
  TransactionData,
  getTransactionStatus as fclGetTransactionStatus,
} from '@samatech/onflow-fcl-esm'

// Fetch the latest block in the blockchain
export const fetchLatestBlock = async (): Promise<BlockObject> => {
  return send([
    getBlock(true), // isSealed = true
  ]).then(decode)
}

// Fetch all the events fired between start and end heights for the given event name
export const fetchEventsAtBlockHeightRange = async (
  targetEvent: string,
  start: number,
  end: number,
): Promise<CadenceEvent[]> => {
  return send(await build([getEventsAtBlockHeightRange(targetEvent, start, end)])).then(
    decode,
  )
}

// Get all the information about transaction which includes its status and events
export const getTransactionStatus = async (
  transactionId: string,
): Promise<TransactionData> => {
  return send(await build([fclGetTransactionStatus(transactionId)])).then(decode)
}
