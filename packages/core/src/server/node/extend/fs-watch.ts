/**
 * 监听文件，通过拦截 fs 上的 api，从而确定文件系统操作
 * 目前所有文件操作都必须通过 bfs api，因此此种方式可以达到目的
 * 对于手动去修改 indexedDB 等操作的，由于并不直接暴露给用户，因此一般情况下无需考虑
 * API 保持和目前 ide-fw 中使用的 nsfw 中一致
 */

import { fs, path } from '../internal'
import { Emitter, IDisposable } from '@ali/ide-core-common'
import debounce from 'lodash.debounce'

export const enum ActionType {
  CREATED = 0,
  DELETED = 1,
  MODIFIED = 2,
  RENAMED = 3
}

type CreatedFileEvent = GenericFileEvent<ActionType.CREATED>;
type DeletedFileEvent = GenericFileEvent<ActionType.DELETED>;
type ModifiedFileEvent = GenericFileEvent<ActionType.MODIFIED>;
type FileChangeEvent = CreatedFileEvent | DeletedFileEvent | ModifiedFileEvent | RenamedFileEvent;

interface RenamedFileEvent {
  /** the type of event that occurred */
  action: ActionType.RENAMED;
  /** the directory before a rename */
  directory: string;
  /**  the name of the file before a rename*/
  oldFile: string;
  /** the new location of the file(only useful on linux) */
  newDirectory: string;
  /** the name of the file after a rename */
  newFile: string;
}

interface GenericFileEvent<T extends ActionType> {
  /** the type of event that occurred */
  action: T;
  /** the location the event took place */
  directory: string;
  /** the name of the file that was changed(Not available for rename events) */
  file: string;
}

export interface ChangeEvent {
  action: ActionType;
  directory: string;
  file?: string;
  oldFile?: string;
  newFile?: string;
  newDirectory?: string;
}

interface Options {
  /** time in milliseconds to debounce the event callback */
  debounceMS?: number;
}

const emitter = new Emitter<FileChangeEvent>()

const api = [
  { name: 'mkdir', action: ActionType.CREATED },
  { name: 'rmdir', action: ActionType.DELETED },
  { name: 'unlink', action: ActionType.DELETED },
  { name: 'rename', action: ActionType.RENAMED },
] as const

const apiSync = [
  { name: 'mkdirSync', action: ActionType.CREATED },
  { name: 'rmdirSync', action: ActionType.DELETED },
  { name: 'unlinkSync', action: ActionType.DELETED },
  { name: 'renameSync', action: ActionType.RENAMED },
] as const

api.forEach(({ name, action }) => {
  const method: any = fs[name]
  fs[name] = (p: string, ...args: any[]) => {
    p = path.resolve(p)
    const cb = args[args.length - 1]
    checkCb(cb)
    args[args.length - 1] = (err: any) => {
      const res = cb(err)
      if (!err) {
        emitter.fire({
          action,
          directory: path.dirname(p),
          ...(name !== 'rename' ? {
            file: path.basename(p),
          } : {
            oldFile: path.basename(p),
            newDirectory: path.dirname(args[1]),
            newFile: path.basename(args[1])
          })
        } as FileChangeEvent)
      }
      return res
    }
    method(p, ...args)
  }
})

apiSync.forEach(({ name, action }) => {
  const method: any = fs[name]
  fs[name] = (p: string, ...args: any[]) => {
    p = path.resolve(p)
    const res = method(p, ...args)
    emitter.fire({
      action,
      directory: path.dirname(p),
      ...(name !== 'renameSync' ? {
        file: path.basename(p),
      } : {
        oldFile: path.basename(p),
        newDirectory: path.dirname(args[1]),
        newFile: path.basename(args[1])
      })
    } as FileChangeEvent)
    return res
  }
})

const fd2Path: Record<number, string> = {}

const _open = fs.open
fs.open = (p: string, flag: string, mode: any, cb?: any) => {
  p = resolvePath(p)
  fs.stat(p, (err) => {
    // 文件不存在且为写模式，那么会自动创建文件
    const willCreated = err && mayCreatedFile(flag)
    const _cb = typeof mode === 'function' ? mode : cb
    checkCb(cb)
    const newCb = (err: any, fd: any) => {
      fd2Path[fd] = p
      const res = _cb(err, fd)
      if (!err && willCreated) {
        emitter.fire({
          action: ActionType.CREATED,
          directory: path.dirname(p),
          file: path.basename(p)
        })
      }
      return res
    }
    if (typeof mode === 'function') {
      _open(p, flag, newCb)
    } else {
      _open(p, flag, mode, newCb)
    }
  })
}

const _openSync = fs.openSync
fs.openSync = (p, flag, mode) => {
  p = resolvePath(p)
  const willCreated = !fs.existsSync(p) && mayCreatedFile(flag)
  const fd = _openSync(p, flag, mode)
  fd2Path[fd] = p
  if (willCreated) {
    emitter.fire({
      action: ActionType.CREATED,
      directory: path.dirname(p),
      file: path.basename(p)
    })
  }
  return fd
}

/**
 * browserfs 在 close 关闭时才写入
 */

const _close = fs.close
fs.close = (fd, cb) => {
  checkCb(cb)
  _close(fd, (err) => {
    cb(err)
    if (!err) {
      const p = fd2Path[fd]
      emitter.fire({
        action: ActionType.MODIFIED,
        directory: path.dirname(p),
        file: path.basename(p)
      })
    }
    delete fd2Path[fd]
  })
}

const _closeSync = fs.closeSync
fs.closeSync = (fd) => {
  _closeSync(fd)
  const p = fd2Path[fd]
  emitter.fire({
    action: ActionType.MODIFIED,
    directory: path.dirname(p),
    file: path.basename(p)
  })
  delete fd2Path[fd]
}

function resolvePath(p: string) {
  return path.resolve(p)
}

function checkCb(cb: any): asserts cb is Function {
  if (typeof cb !== 'function') {
    throw new Error('Callback must be a function.');
  }
}

function mayCreatedFile(flag: string) {
  return flag !== 'r+' && (
    flag.includes('w') ||
    flag.includes('a') ||
    flag.includes('+')
  )
}

function call(cb: Function, args: any[]){
  /**
   * like browserfs, Function call/apply is expensive
   */
  switch (args.length) {
    case 1:
      return cb(args[0])
    case 2:
      return cb(args[0], args[1])
    case 3:
      return cb(args[0], args[2], args[3])
    default:
      return cb(...args)
  }
}

export interface FW {
  start: () => void;
  stop: () => void;
}

interface FWFunction {
  (watchPath: string, eventCallback: (events: Array<ChangeEvent>) => void, options?: Partial<Options>): Promise<FW>;
  actions: Record<keyof typeof ActionType, number>
}

export const watch: FWFunction = (
  dirOrFile: string,
  eventHandler: (events: ChangeEvent[]) => void,
  { debounceMS = 500 } = {}
) => {
  if (Number.isInteger(debounceMS)) {
    if (debounceMS < 1) {
      throw new Error('Minimum debounce is 1ms.');
    }
  } else {
    throw new Error('debounceMS must be an integer.');
  }

  return new Promise<FW>((resolve, reject) => {
    fs.stat(dirOrFile, (err, stat) => {
      if (err) {
        reject(new Error('Path must be a valid path to a file or a directory.'))
      }
      let dir: string, file: string
      if (stat!.isFile()) {
        dir = path.dirname(dirOrFile)
        file = path.basename(dirOrFile)
      }
      let disposables: IDisposable[] = []
      let changeEvents: ChangeEvent[] = []
      resolve({
        start() {
          const debouncedEvent = debounce(() => {
            eventHandler([...changeEvents])
            changeEvents.length = 0
          }, debounceMS)
          disposables.push({
            dispose: debouncedEvent.cancel
          })
          const collect = (change: ChangeEvent) => {
            changeEvents.push(change)
            debouncedEvent()
          }
          emitter.event((change) => {
            if (file) {
              if (change.directory !== dir) {
                return
              }
              if (change.action !== ActionType.RENAMED && change.file === file) {
                collect(change)
              } else if (change.action === ActionType.RENAMED && change.oldFile === file) {
                collect({
                  action: ActionType.DELETED,
                  directory: change.directory,
                  file: change.oldFile
                })
              }
            } else {
              if (change.action !== ActionType.RENAMED) {
                if (change.directory.startsWith(dir)) {
                  collect(change)
                }
              } else {
                if (change.directory.startsWith(dir) && change.newDirectory?.startsWith(dir)) {
                  collect(change)
                } else if (change.directory.startsWith(dir)) {
                  // deleted
                  collect({
                    action: ActionType.DELETED,
                    directory: change.directory,
                    file: change.oldFile
                  })
                } else if (change.newDirectory?.startsWith(dir)) {
                  // created
                  collect({
                    action: ActionType.CREATED,
                    directory: change.newDirectory,
                    file: change.newFile
                  })
                }
              }
            }
          }, null, disposables)
        },
        stop() {
          disposables.forEach(d => d.dispose())
        }
      })
    })
  })
}

watch.actions = {
  CREATED: ActionType.CREATED,
  DELETED: ActionType.DELETED,
  MODIFIED: ActionType.MODIFIED,
  RENAMED: ActionType.RENAMED
}
