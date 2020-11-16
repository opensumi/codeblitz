import { Injectable, Autowired } from '@ali/common-di'
import {
  IEditorDocumentModelSaveResult,
  URI,
  IEditorDocumentChange,
  BasicTextLines,
  isEditChange,
  Uri,
} from '@ali/ide-core-common'
import { IDiskFileProvider, FileAccess } from '@ali/ide-file-service'
import md5 from 'md5'
import {
  IFileSchemeDocNodeService,
  ISavingContent,
  IContentChange,
} from '@ali/ide-file-scheme/lib/common'

import { fse, buffer } from '../node'

const { existsSync, readFile, statSync, writeFile } = fse
const { Buffer } = buffer

// TODO:
// 只处理 file 协议，其它协议暂不支持
@Injectable()
export class FileSchemeDocNodeServiceImpl implements IFileSchemeDocNodeService {
  @Autowired(IDiskFileProvider)
  private fileService: IDiskFileProvider

  async $saveByChange(
    uri: string,
    change: IContentChange,
    encoding?: BufferEncoding | undefined,
    force: boolean = false
  ): Promise<IEditorDocumentModelSaveResult> {
    try {
      const fsPath = new URI(uri).codeUri.fsPath
      if (existsSync(fsPath)) {
        const mtime = statSync(fsPath).mtime.getTime()
        const contentBuffer = await readFile(fsPath)
        const content = contentBuffer.toString(encoding ? encoding : 'utf8')
        if (!force) {
          const currentMd5 = md5(content)
          if (change.baseMd5 !== currentMd5) {
            return {
              state: 'diff',
            }
          }
        }
        const contentRes = applyChanges(content, change.changes!, change.eol)
        if (statSync(fsPath).mtime.getTime() !== mtime) {
          throw new Error('File has been modified during saving, please retry')
        }
        await writeFile(fsPath, Buffer.from(contentRes, encoding ? encoding : 'utf8'))
        return {
          state: 'success',
        }
      } else {
        return {
          state: 'error',
          errorMessage: 'useByContent',
        }
      }
    } catch (e) {
      return {
        state: 'error',
        errorMessage: e.toString(),
      }
    }
  }

  async $saveByContent(
    uri: string,
    content: ISavingContent,
    encoding?: string | undefined,
    force: boolean = false
  ): Promise<IEditorDocumentModelSaveResult> {
    try {
      const _uri = Uri.parse(uri)
      const stat = await this.fileService.stat(_uri)
      if (stat) {
        if (!force) {
          const res = await this.fileService.readFile(_uri, encoding)
          if (content.baseMd5 !== md5(res)) {
            return {
              state: 'diff',
            }
          }
        }
        await this.fileService.writeFile(_uri, content.content, {
          create: true,
          overwrite: false,
          encoding,
        })
        return {
          state: 'success',
        }
      } else {
        await this.fileService.writeFile(_uri, content.content, {
          create: true,
          overwrite: false,
          encoding,
        })
        return {
          state: 'success',
        }
      }
    } catch (e) {
      return {
        state: 'error',
        errorMessage: e.toString(),
      }
    }
  }

  async $getMd5(uri: string, encoding?: string | undefined): Promise<string | undefined> {
    try {
      const _uri = Uri.parse(uri)
      if (await this.fileService.access(_uri, FileAccess.Constants.F_OK)) {
        const res = await this.fileService.readFile(_uri, encoding)
        return md5(res)
      } else {
        return undefined
      }
    } catch (e) {
      return undefined
    }
  }
}

/**
 * 注意： 对于一个change来说，同时执行的多个 operation 对应的都是同一个原始 content;
 * 常见例子: vscode 中 cmd+d 编辑
 * @param content
 * @param changes
 */

export function applyChanges(
  content: string,
  changes: IEditorDocumentChange[],
  eol: '\n' | '\r\n'
): string {
  const textLines = new BasicTextLines(content.split(eol), eol)
  changes.forEach((change) => {
    if (isEditChange(change)) {
      change.changes.forEach((change) => {
        // 这里从前端传过来的 changes 已经倒序排序过，所以可以安全的 apply
        textLines.acceptChange(change)
      })
    } else {
      textLines.acceptEol(change.eol)
    }
  })
  return textLines.getContent()
}

function getUri(uri: string | Uri): URI {
  const _uri = new URI(uri)

  if (!_uri.scheme) {
    throw new Error(`没有设置 scheme: ${uri}`)
  }

  return _uri
}
