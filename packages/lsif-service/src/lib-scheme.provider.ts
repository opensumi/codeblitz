import { Emitter, URI } from '@ali/ide-core-browser';
import { LRUCache } from '@ali/ide-core-common/lib/map';
import { IEditorDocumentModelContentProvider } from '@ali/ide-editor/lib/browser';
import { LsifClient } from '@alipay/lsif-client';
import axios from 'axios';

import { ModelScheme } from './constant';

export class LibEditorDocumentModelProvider implements IEditorDocumentModelContentProvider {
  constructor(private lsifClient: LsifClient) {}

  private cache = new LRUCache<string, Promise<string>>(100);

  onDidChangeContent = new Emitter<URI>().event;

  handlesScheme(scheme: string) {
    return scheme === ModelScheme.Jar;
  }

  isReadonly() {
    return true;
  }

  provideEditorDocumentModelContent(uri: URI) {
    const key = uri.toString();
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }
    if (uri.scheme === ModelScheme.Jar) {
      const res = this.fetchJarContent(uri);
      this.cache.set(key, res);
      res.catch(() => this.cache.delete(key));
      return res;
    }
    return Promise.resolve('');
  }

  async fetchJarContent(uri: URI) {
    const path = uri.path.toString();
    const rex = /^\/?([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)$/;

    const match = path.match(rex);
    if (!match) {
      throw new Error('uri string not match');
    }

    const [_, scope, name, version, filepath] = match;

    const endpoint = `/api/lsif/jar-content?module=${scope}:${name}:${version}&filePath=${filepath}`;

    // 放在 lsif-client
    const ret = await axios.get(endpoint, {
      // @ts-ignore
      ...this.lsifClient.requestConfig,
    });
    return (ret.data.success && ret.data.content) || '';
  }
}
