const { findUserStatus } = require('../repository/status');

const getStatus = (req, res) => {
    try {
        // inventory: StackNull for (stackLimit - stackNull / stackLimit)
        const response = findUserStatus();
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

module.exports = {
    getStatus
};
