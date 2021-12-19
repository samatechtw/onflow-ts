export type ContractMap = Record<string, string>;

const REGEXP_IMPORT = /(\s*import\s*)([\w\d]+)(\s+from\s*)([\w\d".\\/]+)/g;

const getPairs = (line: string): string[] => {
  return line
    .split(/\s/)
    .map((item) => item.replace(/\s/g, ''))
    .filter((item) => item.length > 0 && item !== 'import' && item !== 'from');
};

const collect = (acc: ContractMap, item: string[]): ContractMap => {
  const [contract, address] = item;
  acc[contract] = address;
  return acc;
};

/**
 * Get an address map for contracts defined in template code.
 * @param {string} code - Cadence code to parse.
 */
export const extractImports = (code: string): ContractMap => {
  if (!code || code.length === 0) {
    return {};
  }
  return code
    .split('\n')
    .filter((line) => line.includes('import'))
    .map(getPairs)
    .reduce(collect, {});
};

/**
 * Get Cadence template code with replaced import addresses
 */
export const replaceImportAddressesUtil = (
  code: string,
  addressMap: ContractMap,
): string => {
  return code.replace(REGEXP_IMPORT, (_match, imp, contract, _, _address) => {
    const newAddress = addressMap[contract];
    return `${imp}${contract} from ${newAddress}`;
  });
};

/**
 * Get a Cadence template from a file.
 * Imports are replaced via `addressMap`
 */
export const getTemplate = (rawCode: string, addressMap: ContractMap = {}): string => {
  return addressMap ? replaceImportAddressesUtil(rawCode, addressMap) : rawCode;
};
