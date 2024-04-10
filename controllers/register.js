const db = require('../config/db.js');

const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userQuery = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userQuery.rows.length) {
            res.status(409).json({
                message: 'Username already exists.'
            });
        } else {
            const userCreate = await db.query('INSERT INTO users(username, password) VALUES ($1, $2) RETURNING id', [username, password]);
            const userInventory = await db.query('INSERT INTO inventories (user_id) VALUES ($1)', [userCreate.rows[0].id]);
            console.log(userInventory.rows[0]);
            res.status(201).json({
                message: 'User created successfully.'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

module.exports = register;
