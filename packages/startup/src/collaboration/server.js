const app = require('http').createServer();
const { Server } = require('socket.io');
const { TextOperation, Server: OTServer } = require('ot');

const io = new Server(app, {
  cors: true,
});

app.listen(9099);

const otServer = new OTServer('');

io.on('connection', function (socket) {
  let user = null
  socket.on('join', (data) => {
    user = data
    socket.broadcast.emit('join', data);
  })

  socket.on('state', (fn) => {
    fn({
      revision: otServer.operations ? otServer.operations.length : 0,
      code: otServer.document,
    })
  });

  socket.on('operation', function (data, fn) {
    const operation = TextOperation.fromJSON(data.ops);
    try {
      const transformedOperation = otServer.receiveOperation(data.revision, operation);
      fn(true);
      socket.broadcast.emit('operation', { ops: transformedOperation.toJSON(), userId: data.userId });
    } catch (err) {
      console.error(err);
      fn(false);
    }
  });

  socket.on('selection', (data) => {
    socket.broadcast.emit('selection', data);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('leave', user);
 });
});
