import { Injectable, Autowired } from '@ali/common-di';
import {
  IEditorDocumentModelSaveResult,
  URI,
  IEditorDocumentChange,
  BasicTextLines,
  isEditChange,
} from '@ali/ide-core-common';
import { IFileService } from '../file-service/base';
import md5 from 'md5';
import { ISavingContent, IContentChange } from '@ali/ide-file-scheme/lib/common';
import { IFileSchemeDocNodeService } from './base';
import { fsExtra as fse } from '../node';
import { encode, decode } from '../file-service/encoding';

@Injectable()
export class FileSchemeDocNodeServiceImpl implements IFileSchemeDocNodeService {
  @Autowired(IFileService)
  private fileService: IFileService;

  // 由于此处只处理file协议，为了简洁，不再使用 fileService,

  async $saveByChange(
    uri: string,
    change: IContentChange,
    encoding?: string | undefined,
    force: boolean = false
  ): Promise<IEditorDocumentModelSaveResult> {
    try {
      const fsPath = new URI(uri).codeUri.path;
      if (await fse.pathExists(fsPath)) {
        const mtime = (await fse.stat(fsPath)).mtime.getTime();
        const contentBuffer = await fse.readFile(fsPath);
        const content = decode(contentBuffer, encoding ? encoding : 'utf8');
        if (!force) {
          const currentMd5 = md5(content);
          if (change.baseMd5 !== currentMd5) {
            return {
              state: 'diff',
            };
          }
        }
        const contentRes = applyChanges(content, change.changes!, change.eol);
        if ((await fse.stat(fsPath)).mtime.getTime() !== mtime) {
          throw new Error('File has been modified during saving, please retry');
        }
        await fse.writeFile(fsPath, encode(contentRes, encoding ? encoding : 'utf8'));
        return {
          state: 'success',
        };
      }
      return {
        state: 'error',
        errorMessage: 'useByContent',
      };
    } catch (e: any) {
      return {
        state: 'error',
        errorMessage: e.toString(),
      };
    }
  }

  async $saveByContent(
    uri: string,
    content: ISavingContent,
    encoding?: string | undefined,
    force: boolean = false
  ): Promise<IEditorDocumentModelSaveResult> {
    try {
      const stat = await this.fileService.getFileStat(uri);
      if (stat) {
        if (!force) {
          const res = await this.fileService.resolveContent(uri, { encoding });
          if (content.baseMd5 !== md5(res.content)) {
            return {
              state: 'diff',
            };
          }
        }
        await this.fileService.setContent(stat, content.content, { encoding });
        return {
          state: 'success',
        };
      }
      await this.fileService.createFile(uri, { content: content.content, encoding });
      return {
        state: 'success',
      };
    } catch (e: any) {
      return {
        state: 'error',
        errorMessage: e.toString(),
      };
    }
  }

  async $getMd5(uri: string, encoding?: string | undefined): Promise<string | undefined> {
    try {
      if (await this.fileService.access(uri)) {
        const res = await this.fileService.resolveContent(uri, { encoding });
        return md5(res.content);
      }
    } catch (e) {
      return undefined;
    }
  }
}

// TODO: eol 哪里的
export function applyChanges(
  content: string,
  changes: IEditorDocumentChange[],
  eol: '\n' | '\r\n'
): string {
  const textLines = new BasicTextLines(content.split(eol), eol);
  changes.forEach((change) => {
    if (isEditChange(change)) {
      change.changes.forEach((change) => {
        textLines.acceptChange(change);
      });
    } else {
      textLines.acceptEol(change.eol);
    }
  });
  return textLines.getContent();
}
