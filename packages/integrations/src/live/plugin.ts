import { IPluginAPI } from '@alipay/alex';

export enum LIVE_COMMAND {
  Disconnect = 'live.disconnect',
  Reconnect = 'live.reconnect',
  Initialize = 'live.initialize',
  Initialized = 'live.initialized',
  SendOperation = 'live.sendOperation',
  ApplyOperation = 'live.applyOperation',
  SendSelection = 'live.sendSelection',
  ApplySelection = 'live.applySelection',
  Join = 'live.join',
  Leave = 'live.level',
  SyncState = 'live.syncState',
}

class Deferred<T> {
  resolve: (value: T) => void;
  reject: (err?: any) => void;

  promise = new Promise<T>((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  });
}

const extReady = new Deferred<void>();
const initStateReady = new Deferred<any>();
let commands: IPluginAPI['commands'];

const socket = (window as any).io('http://localhost:10901');

const type = location.search.match(/[?&]type=([^$]+)/)?.[1];

console.log('>>>type', type);

if (!type) {
  throw new Error('query 无 type, 1 标识面试官，2 表示面试者');
}

const Interviewer = {
  userId: 0,
  name: '考官',
};

const Interviewee = {
  userId: 1,
  name: '考生',
};

const currentRole = type === '1' ? Interviewer : Interviewee;
const otherRole = type === '2' ? Interviewer : Interviewee;

const executeCommand = async (commandId: LIVE_COMMAND, data?: any) => {
  await extReady.promise;
  commands.executeCommand(commandId, data);
};

socket
  .on('connect', async () => {
    socket.emit('state', (data) => {
      initStateReady.resolve({
        ...currentRole,
        revision: data.revision,
        code: data.code,
      });
    });
  })
  .on('disconnect', async () => {
    executeCommand(LIVE_COMMAND.Disconnect);
  })
  .on('reconnect', async () => {
    executeCommand(LIVE_COMMAND.Reconnect);
  })
  .on('operation', (data) => {
    executeCommand(LIVE_COMMAND.ApplyOperation, {
      userId: otherRole.userId,
      ...data,
    });
  })
  .on('selection', (data) => {
    console.log('>>>otherRole', otherRole.userId);
    executeCommand(LIVE_COMMAND.ApplySelection, {
      userId: otherRole.userId,
      ...data,
    });
  });

export const PLUGIN_ID = 'live';

export const activate = ({ context, commands: commands_ }: IPluginAPI) => {
  commands = commands_;

  commands.executeCommand('alitcode:activate');

  context.subscriptions.push(
    commands.registerCommand(LIVE_COMMAND.Initialize, async () => {
      extReady.resolve();
      return initStateReady.promise;
      // return new Promise(resolve => {
      //   socket.emit('state', data => {
      //     resolve({
      //       ...currentRole,
      //       revision: data.revision,
      //       code: data.code,
      //     })
      //   })
      // })
    }),

    commands.registerCommand(LIVE_COMMAND.Initialized, () => {
      commands.executeCommand(LIVE_COMMAND.Join, otherRole);
    }),

    commands.registerCommand(LIVE_COMMAND.SyncState, async () => {
      return new Promise((resolve) => {
        socket.emit('state', resolve);
      });
    }),

    commands.registerCommand(LIVE_COMMAND.SendOperation, (data) => {
      return new Promise((resolve, reject) => {
        socket.emit('operation', data, resolve);
      });
    }),

    commands.registerCommand(LIVE_COMMAND.SendSelection, (data) => {
      return new Promise((resolve, reject) => {
        socket.emit('selection', data, resolve);
      });
    })
  );
};
