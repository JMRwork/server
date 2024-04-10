const db = require('../config/db.js');

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        console.log(username);
        const userData = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = userData.rows;
        console.log(user);
        console.log(user.length);
        if (user.length === 0) {
            res.status(401).json({
                message: 'Credentials not correct.'
            });
        } else if (user[0].password === password) {
            req.session.id = user[0].id;
            req.session.username = user[0].username;
            res.cookie('u_on', 'true', { maxAge: 3 * 60 * 60 * 1000 });
            res.status(200).redirect('/home');
        } else {
            res.status(401).json({
                message: 'Credentials not correct.'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

module.exports = login;
