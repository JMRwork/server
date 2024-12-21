const { getInventoryService, ChangeInventoryService } = require('../services/inventory');

const getInventory = async (req, res) => {
    try {
        const userSessionId = req.session.id;
        if (userSessionId) {
            const response = await getInventoryService(userSessionId);
            if (response.sucessful) {
                res.status(200).json(response.userInventory);
            } else {
                res.status(404).json({ message: response.error });
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

const getItems = (req, res) => {
    try {
        res.status(200).json([{
            itemId: 1,
            name: 'Block of Wood',
            description: 'A piece of wood that can be artfully transformed in construction materials, other objects or even combustible.',
            price: 1,
            qty: 10
        },
        {
            itemId: 2,
            name: 'Food',
            description: 'A joint of edibles consumables that is used to feed and maintain live ones.',
            price: 1,
            qty: 10
        },
        {
            itemId: 5,
            name: 'Container of Water',
            description: 'Water is used for multi-purpose activities. It\'s essencial in many processes, inclusive in maintain life.',
            price: 1,
            qty: 10
        }]);
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
