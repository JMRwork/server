const { getStatusService, getLocationService, getInventoryCapService, getCurrencyService } = require('../services/status');
const { verifySession } = require('../middleware/session');

const getStatus = async (req, res) => {
    try {
        const userId = verifySession(req, res);
        if (userId) {
            // inventory: StackNull for (stackLimit - stackNull / stackLimit)
            const response = await getStatusService(userId);
            res.status(200).json(response);
        } else {
            return res.status(401).json({
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

const getLocation = async (req, res) => {
    try {
        const userId = verifySession(req, res);
        if (userId) {
            const response = await getLocationService(userId);
            res.status(200).json(response);
        } else {
            return res.status(401).json({
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

const getInventoryCap = async (req, res) => {
    try {
        const userId = verifySession(req, res);
        if (userId) {
            const response = await getInventoryCapService(userId);
            res.status(200).json(response);
        } else {
            return res.status(401).json({
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

const getCurrency = async (req, res) => {
    try {
        const userId = verifySession(req, res);
        if (userId) {
            const response = await getCurrencyService(userId);
            res.status(200).json(response);
        } else {
            return res.status(401).json({
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
    getStatus,
    getLocation,
    getInventoryCap,
    getCurrency
};
