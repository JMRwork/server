const db = require('../config/db.js');

const getUserInventory = async (req, res) => {
    try {
        const id = req.session.id;
        if (id) {
            const userInventoryObj = await db.query('SELECT * FROM inventories WHERE user_id = $1', [id]);
            const userInventoryArray = Object.values(userInventoryObj.rows[0]);
            userInventoryArray.shift();
            res.status(200).json(userInventoryArray);
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

const updateUserInventory = async (req, res) => {
    try {
        const id = req.session.id;
        if (id) {
            // Getting user changes and user items data on db
            // const inventoryChanges = { operation: 'remove', qty: 10, itemId: 1 };
            const inventoryChanges = req.body;
            console.log(inventoryChanges);
            const itemChanged = { state: false, operation: inventoryChanges.operation, qty: 0 };
            const currencyChanged = { state: false };
            if (inventoryChanges.origin === 'market') {
                currencyChanged.marketStore = { itemId: 1, price: 1, qty: 10 };
                currencyChanged.userCurrency = 0;
                currencyChanged.state = true;
            }
            const inventory = await db.query('SELECT * FROM inventories WHERE user_id = $1', [id]);
            // Data structuring to accomplish changes
            const inventoryObj = inventory.rows[0];
            delete inventoryObj.user_id;
            const stackInventory = {
                null: 0
            };
            for (const itemIdSlot in inventoryObj) {
                stackInventory[inventoryObj[itemIdSlot]] = stackInventory[inventoryObj[itemIdSlot]] + 1 || 1;
            }
            console.log(stackInventory);
            // Changing Data state
            if (inventoryChanges.operation === 'add') {
                if (inventoryChanges.qty > stackInventory.null) {
                    inventoryChanges.qty = stackInventory.null;
                }
                if (inventoryChanges.origin === 'market') {
                    currencyChanged.currency = inventoryChanges.qty * currencyChanged.marketStore.price;
                    console.log(currencyChanged);
                    if (currencyChanged.currency > currencyChanged.userCurrency) {
                        inventoryChanges.qty = Math.floor(currencyChanged.userCurrency / currencyChanged.marketStore.price);
                        currencyChanged.currency = inventoryChanges.qty * currencyChanged.marketStore.price;
                    }
                }
                if (inventoryChanges.qty > 0) {
                    for (const itemIdSlot in inventoryObj) {
                        if (inventoryObj[itemIdSlot] === null) {
                            inventoryObj[itemIdSlot] = inventoryChanges.itemId;
                            itemChanged.qty += 1;
                        }
                        if (itemChanged.qty === inventoryChanges.qty) break;
                    }
                }
            } else if (inventoryChanges.operation === 'remove') {
                if (inventoryChanges.qty > stackInventory[inventoryChanges.itemId]) {
                    inventoryChanges.qty = stackInventory[inventoryChanges.itemId];
                }
                if (inventoryChanges.origin === 'market') {
                    currencyChanged.currency = inventoryChanges.qty * currencyChanged.marketStore.price;
                    console.log(currencyChanged);
                }
                if (inventoryChanges.qty > 0) {
                    for (const itemIdSlot in inventoryObj) {
                        if (inventoryObj[itemIdSlot] === inventoryChanges.itemId) {
                            inventoryObj[itemIdSlot] = null;
                            itemChanged.qty += 1;
                        }
                        if (itemChanged.qty === inventoryChanges.qty) break;
                    }
                }
            }
            // else if (inventoryChanges.operation === 'replace') {}
            // Commit to inventories table
            if (itemChanged.qty > 0) {
                itemChanged.state = true;
            }

            console.log(itemChanged);
            if (itemChanged.state) {
                const inventoryNewState = [];
                for (const itemIdSlot in inventoryObj) {
                    inventoryNewState.push(inventoryObj[itemIdSlot]);
                }
                console.log(inventoryNewState);
                await db.query('UPDATE inventories SET itemid1 = $1, itemid2 = $2, itemid3 = $3, itemid4 = $4, itemid5 = $5, itemid6 = $6, itemid7 = $7, itemid8 = $8, itemid9 = $9, itemid10 = $10 WHERE user_id = $11', [...inventoryNewState, id]);
                if (currencyChanged.state) {
                    res.status(200).json({
                        message: `${itemChanged.operation === 'add' ? 'buy' : 'sell'} of ${itemChanged.qty} items on inventory for ${currencyChanged.currency}¢ is sucessful.`
                    });
                } else {
                    res.status(200).json({
                        message: `${itemChanged.operation} of ${itemChanged.qty} items on inventory is sucessful.`
                    });
                }
            } else if (itemChanged.operation === 'add' && stackInventory.null === 0) {
                res.status(202).json({
                    message: 'Inventory full.'
                });
            } else if (itemChanged.operation === 'add' && currencyChanged.state) {
                res.status(202).json({
                    message: 'Currency not enought.'
                });
            } else if (itemChanged.operation === 'remove' && stackInventory[inventoryChanges.itemId] === undefined) {
                res.status(202).json({
                    message: 'There is none of this item in the inventory.'
                });
            } else {
                res.status(406).json({
                    message: 'Inventory hasn\'t changed.'
                });
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

const getItems = async (req, res) => {
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
    getUserInventory,
    updateUserInventory,
    getItems
};
