const { registerService } = require('../services/register');

const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({
                message: 'Credentials are required.'
            });
        } else {
            const response = await registerService(username, password);
            if (response.message === 'User created successfully') {
                res.status(201).json({
                    message: response.message
                });
            } else {
                res.status(409).json({
                    message: response.message
                });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

module.exports = register;
