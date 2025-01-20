const { getItemsService, getInventoryService, ChangeInventoryService } = require('../services/inventory');

const getInventory = async (req, res) => {
    try {
        const userSessionId = req.session.id;
        if (userSessionId) {
            const response = await getInventoryService(userSessionId);
            if (response.error) {
                res.status(404).json({ message: response.error });
            } else {
                res.status(200).json(response);
            }
        } else {
            res.status(401).json({
                message: 'User need to be authenticated.'
            });
        };
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

const updateInventory = async (req, res) => {
    try {
        const userId = req.session.id;
        if (userId) {
            const inventoryChanges = req.body;
            const response = await ChangeInventoryService(userId, inventoryChanges);
            res.status(200).json(response);
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

const getItems = async (req, res) => {
    try {
        const response = await getItemsService();
        console.log(response);
        if (response.message) {
            res.status(404).json(response);
        } else {
            res.status(200).json(response);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

module.exports = {
    getInventory,
    updateInventory,
    getItems
};
