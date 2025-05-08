const { loginService } = require('../services/auth');
const { setSession } = require('../middleware/session');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({
                message: 'Credentials are required.'
            });
        } else {
            const response = await loginService(username, password);
            console.log(response);
            if (response.message) {
                res.status(401).json({
                    message: response.message
                });
            } else {
                setSession(res, response.id, response.username);
                res.status(302).redirect('/game');
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

const logout = (req, res) => {
    req.session = null;
    res.clearCookie('token');
    res.clearCookie('u_on');
    res.status(200).redirect('/');
};

module.exports = {
    login,
    logout
};
