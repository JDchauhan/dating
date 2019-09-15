var jwt = require('jsonwebtoken');

var Config = require('../Config');

var io;
var server;

exports.connectSocket = (tmpio, tserver) => {
    io = tmpio;
    server = tserver;
    if (!server.app) {
        server.app = {}
    }
    server.app.socketConnections = {};

    io.on('disconnect', function () {
        console.log('socket disconnected')
    });

    io.use(function (socket, next) {
        if (socket.handshake.query && socket.handshake.query.token) {
            jwt.verify(socket.handshake.query.token, Config.App.JWT_SECRET, function (err, decoded) {
                if (err) return next(new Error('Authentication error'));
                socket.decoded = decoded;
                server.app.socketConnections[socket.decoded._id.toString()] = {
                    socketId: socket.id
                }
                
                next();
            });
        } else {
            next(new Error('Authentication error'));
        }
    }).on('connection', (socket) => {
        io.to(socket.id).emit('message',{message: 'Socket id Updated', performAction: 'INFO'});    
        console.log('socket connected', socket.id);
    });
};

process.on('Notify_like', (data) => {
    if(data && data.to) {
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
        console.log(data.to);
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
        if(server.app && server.app.socketConnections && server.app.socketConnections[data.to] && server.app.socketConnections[data.to].socketId) {
            console.log('emitting to following >>>>>>>',data.to,server.app.socketConnections[data.to].socketId);
            io.to(server.app.socketConnections[data.to].socketId).emit('notifyUser', {
                by: data.by,
                flag: data.flag
            });
        }
    }
});