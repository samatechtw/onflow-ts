import { getEventId } from './get-event-id';

describe('sharedUtilFlow', () => {
  describe('get event id', () => {
    it('returns event id with the default prefix', () => {
      const contractAddress = '0x0ae53cb6e3f42a79';
      const contractName = 'NFTStorefront';
      const eventName = 'Purchase';
      expect(getEventId(contractAddress, contractName, eventName)).toBe(
        'A.0ae53cb6e3f42a79.NFTStorefront.Purchase',
      );
    });

    it('returns event id with specified prefix', () => {
      const contractAddress = '0ae53cb6e3f42a79';
      const contractName = 'NFTStorefront';
      const eventName = 'Purchase';
      const eventPrefix = 'S';
      expect(getEventId(contractAddress, contractName, eventName, eventPrefix)).toBe(
        'S.0ae53cb6e3f42a79.NFTStorefront.Purchase',
      );
    });
  });
});
