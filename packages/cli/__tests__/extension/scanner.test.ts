import { getExtensionIdByPath } from '../../src/extension/scanner';

describe('cli extension scanner', () => {
  it('should get correct extension id', () => {
    let path = 'kaitian-worker.json-language-features-1.0.0';
    let version = '1.0.0';
    expect(getExtensionIdByPath(path, version)).toEqual({
      publisher: 'kaitian-worker',
      name: 'json-language-features',
    });
    expect(getExtensionIdByPath(path)).toEqual({
      publisher: 'kaitian-worker',
      name: 'json-language-features',
    });

    path = 'kaitian-worker.json-language-features-1.0.0-beta.1';
    version = '1.0.0-beta.1';
    expect(getExtensionIdByPath(path, version)).toEqual({
      publisher: 'kaitian-worker',
      name: 'json-language-features',
    });
    expect(getExtensionIdByPath(path)).toEqual({
      publisher: 'kaitian-worker',
      name: 'json-language-features',
    });

    expect(() => getExtensionIdByPath(path, '1.0.1')).toThrow();

    path = 'alex.worker-0.0.1';
    version = '0.0.1';
    expect(getExtensionIdByPath(path, version)).toEqual({ publisher: 'alex', name: 'worker' });
  });
});
