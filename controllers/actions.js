const { getLocalActionsService } = require('../services/actions');
const { verifySession } = require('../middleware/session');

const getLocalActions = async (req, res) => {
    try {
        const userId = verifySession(req, res);
        console.log(userId);
        if (userId) {
            const response = await getLocalActionsService(userId);
            if (response.message) {
                res.status(500).json(response);
            } else {
                res.status(200).json(response);
            }
        } else {
            res.status(401).json({
                message: 'User need to be authenticated.'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

module.exports = {
    getLocalActions
};
