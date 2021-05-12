import { centerRegistry } from '../src';

describe('registry', () => {
  beforeAll(() => {
    centerRegistry.register('count', { v: 1 });
    centerRegistry.register('count', { v: 2 });
  });

  it('getData', () => {
    expect(centerRegistry.getData('count')?.length).toBe(2);
    expect(centerRegistry.getData('count1')).toBeUndefined();
  });

  it('onRegister', () => {
    expect.assertions(3);
    const disposer = centerRegistry.onRegister('count', (data) => {
      expect(data).toEqual({ v: 3 });
    });
    centerRegistry.register('count', { v: 3 });
    expect(centerRegistry.getData('count')?.length).toBe(3);
    disposer.dispose();
    centerRegistry.register('count', { v: 3 });
    expect(centerRegistry.getData('count')?.length).toBe(4);
  });
});
