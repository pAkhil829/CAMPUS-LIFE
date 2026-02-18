const jwt = require('jsonwebtoken');

function initializeSocket(io) {
    // Authenticate socket connections
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error('Authentication required'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (err) {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`[Socket] User connected: ${socket.user.id} (${socket.user.role})`);

        // Join department-specific room
        if (socket.user.department) {
            socket.join(socket.user.department);
        }

        // Join role-specific room
        socket.join(socket.user.role);

        // Join 'all' room for broadcast
        socket.join('all');

        socket.on('disconnect', () => {
            console.log(`[Socket] User disconnected: ${socket.user.id}`);
        });
    });

    return io;
}

module.exports = initializeSocket;
