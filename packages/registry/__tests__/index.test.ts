import { Registry } from '../src';

describe('registry', () => {
  beforeAll(() => {
    Registry.register('count', { v: 1 });
    Registry.register('count', { v: 2 });
  });

  it('getData', () => {
    expect(Registry.getData('count')?.length).toBe(2);
    expect(Registry.getData('count1')).toBeUndefined();
  });

  it('onRegister', () => {
    expect.assertions(3);
    const disposer = Registry.onRegister('count', (data) => {
      expect(data).toEqual({ v: 3 });
    });
    Registry.register('count', { v: 3 });
    expect(Registry.getData('count')?.length).toBe(3);
    disposer.dispose();
    Registry.register('count', { v: 3 });
    expect(Registry.getData('count')?.length).toBe(4);
  });
});
