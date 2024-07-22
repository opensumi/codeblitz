import { Uri } from '@opensumi/ide-core-common';
import http from 'http';
import portfinder from 'portfinder';
import send from 'send';
import url from 'url';
import { IExtensionServerOptions } from '../extension/type';
import { log } from './log';

export const getHttpUri: (options?: IExtensionServerOptions) => Promise<Uri> = async (options) => {
  const port = await findPort();

  return Uri.from({
    scheme: 'http',
    authority: `${options?.host || 'localhost'}:${port}`,
    path: '/assets',
    query: '',
    fragment: '',
  });
};

export const createServer = async (dirs: string[], uri: Uri) => {
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(url.parse(req.url!).pathname!);
    const targetDir = dirs.find((dir) => pathname.startsWith(`${uri.path}${dir}`));
    if (!targetDir) {
      res.statusCode = 404;
      res.end();
      return;
    }
    const filepath = pathname.slice(`${uri.path}${targetDir}`.length);
    send(req, filepath, {
      maxAge: 0,
      root: targetDir,
    })
      .on('headers', (res: http.ServerResponse) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
      })
      .pipe(res);
  });

  server.listen(Number(uri.authority.split(':')[1]), () => {
    log.info(`Local Extension Server: ${uri.scheme}://${uri.authority}`);
  });
};

const BASE_PORT = 30000;
async function findPort() {
  try {
    const port = await portfinder.getPortPromise({ port: BASE_PORT });
    return port;
  } catch (err) {
    throw err;
  }
}
