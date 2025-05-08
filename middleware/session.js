const jwt = require('jsonwebtoken');

const setSession = (response, id, username) => {
    try {
        const tokenSession = jwt.sign({ id, username }, process.env.SESSIONKEY, { algorithm: 'HS256', expiresIn: 60 * 60 * 3 });
        response.cookie('token', tokenSession, { httpOnly: true, secure: false, sameSite: 'strict' });
        response.cookie('u_on', true);
    } catch (error) {
        console.log(error);
    }
};

const verifySession = (req, res) => {
    if (req.headers.cookies) {
        const cookies = req.headers.cookies;
        cookies.split(';').reduce((acc, c) => {
            const [key, value] = c.trim().split('=');
            acc[key] = value;
            return acc;
        }, {});
        let response;
        if (cookies.token) {
            jwt.verify(cookies.token, process.env.SESSIONKEY, (err, decoded) => {
                if (err) {
                    res.clearCookie('token');
                    res.clearCookie('u_on');
                    response = false;
                }
                console.log(decoded);
                response = decoded.id;
            });
        } else {
            res.clearCookie('u_on');
            response = false;
        }
        return response;
    }
};

module.exports = {
    setSession,
    verifySession
};
