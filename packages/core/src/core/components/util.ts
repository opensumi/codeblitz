import { URI } from '@opensumi/ide-core-browser';
import * as path from 'path'

export const parseUri = (uriInput: URI | string, workspaceDir: string) => {
  if (typeof uriInput === 'string') {
    let uri = URI.parse(uriInput)
    // 说明传的是路径
    if (uri.scheme === 'file' && !uriInput.startsWith('file:')) {
      uri = uri.withPath(path.join(workspaceDir, uri.codeUri.path))
    }
    return uri.toString();
  }
  return uriInput.toString()
}
