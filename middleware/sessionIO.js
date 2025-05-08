const jwt = require('jsonwebtoken');

const ioSession = (socket, next) => {
    // Get the session cookie from the handshake headers
    const cookie = socket.request.headers.cookie;
    if (cookie) {
        // Parse the session cookie
        const cookies = cookie.split(';').reduce((acc, c) => {
            const [key, value] = c.trim().split('=');
            acc[key] = value;
            return acc;
        }, {});

        // Attach the session data to the socket request
        if (cookies.token) {
            const sessionData = jwt.verify(cookies.token, process.env.SESSIONKEY, (err, decoded) => {
                if (err) {
                    return { error: err.message };
                }
                return decoded;
            });
            socket.request.session = sessionData;
        }
    }

    // Call next to proceed with the connection
    next();
};

module.exports = {
    ioSession
};
