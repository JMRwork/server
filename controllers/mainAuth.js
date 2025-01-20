const { loginService } = require('../services/auth');

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
                req.session.id = response.id;
                req.session.username = response.username;
                res.cookie('u_on', true);
                res.status(302).redirect('/home');
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
    res.clearCookie('u_on');
    res.status(200).redirect('/');
};

module.exports = {
    login,
    logout
};
