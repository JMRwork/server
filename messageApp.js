const { Server } = require('socket.io');

function userConnected(socket, io) {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('message', (msg) => {
        io.emit('message', ({ content: msg, username: socket.request.session.username }));
    });
    io.to(socket.id).emit('welcome', 'Welcome to the chat');
}

exports.messageApp = (server) => {
    const io = new Server(server);
    io.on('connection', function (socket) {
        if (socket.request.session) {
            userConnected(socket, io);
            console.log(socket.request.headers.cookie);
        } else {
            io.to(socket.id).emit('error', 'Session not found');
        }
    });
    return io;
};
