/* eslint-disable indent */
const { findUserInventory, updateUserInventory } = require('../repository/inventory');
const { findUserCurrency } = require('../repository/status');

async function getInventoryService(userId) {
    const response = await findUserInventory(userId);
    if (response.sucessful) {
        const userInventoryArray = Object.values(response.userInventoryObj.rows[0]);
        userInventoryArray.shift();
        console.log(userInventoryArray);
        return { sucessful: response.sucessful, userInventory: userInventoryArray };
    }
    return { sucessful: response.sucessful, error: response.error };
}

async function ChangeInventoryService(userId, inventoryChanges) {
    // Getting user changes and user items data on db
    // EX: inventoryChanges = { origin: 'actions', operation: 'remove', qty: 10, itemId: 1 };
    console.log(inventoryChanges);
    const itemChanged = { state: false, operation: inventoryChanges.operation, qty: 0 };
    const currencyChanged = { state: false };

    const userInventoryResponse = await findUserInventory(userId);
    if (!userInventoryResponse.sucessful) {
        return { message: userInventoryResponse.error };
    }
    const inventory = userInventoryResponse.userInventoryObj;
    // Data structuring to accomplish changes
    const userInventoryObj = inventory.rows[0];
    delete userInventoryObj.user_id;
    console.log(userInventoryObj);
    // Changing Data state
    // else if (inventoryChanges.operation === 'replace') {}
    // Commit to inventories table
    switch (inventoryChanges.origin) {
        case 'actions':
            actionsOperationService(userInventoryObj, inventoryChanges, itemChanged);
            break;
        case 'market':
            await marketOperationService(userInventoryObj, inventoryChanges, itemChanged, currencyChanged);
            break;
        default:
            print('Error: Invalid origin.');
    };

    if (itemChanged.qty > 0) {
        itemChanged.state = true;
    }

    console.log(itemChanged);
    if (itemChanged.state) {
        const inventoryNewState = [];
        for (const itemIdSlot in userInventoryObj) {
            inventoryNewState.push(userInventoryObj[itemIdSlot]);
        }
        console.log(inventoryNewState);
        const userDataUpdateResponse = await updateUserInventory(inventoryNewState, userId);
        if (!userDataUpdateResponse.Sucessful) {
            return { message: userDataUpdateResponse.error };
        }
        if (currencyChanged.state) {
            return { message: `${itemChanged.operation === 'add' ? 'buy' : 'sell'} of ${itemChanged.qty} items on inventory for ${currencyChanged.totalValor}¢ is sucessful.` };
        } else {
            return { message: `${itemChanged.operation} of ${itemChanged.qty} items on inventory is sucessful.` };
        }
    } else {
        return { message: 'Inventory hasn\'t changed.' };
    }
    /* else if (itemChanged.operation === 'add' && stackInventory.null === 0) {
        return { message: 'Inventory full.' };
    } else if (itemChanged.operation === 'add' && currencyChanged.state) {
        return { message: 'Currency not enought.' };
    } else if (itemChanged.operation === 'remove' && stackInventory[inventoryChanges.itemId] === undefined) {
        return { message: 'There is none of this item in the inventory.' };
    } else {
        return { message: 'Inventory hasn\'t changed.' };
    } */
}

function actionsOperationService(userInventoryObj, inventoryChanges, itemChanged) {
    if (inventoryChanges.operation === 'add') {
        if (inventoryChanges.qty > 0) {
            for (const itemIdSlot in userInventoryObj) {
                if (userInventoryObj[itemIdSlot] === null) {
                    userInventoryObj[itemIdSlot] = inventoryChanges.itemId;
                    itemChanged.qty += 1;
                }
                if (itemChanged.qty === inventoryChanges.qty) break;
            }
        }
    } else if (inventoryChanges.operation === 'remove') {
        if (inventoryChanges.qty > 0) {
            for (const itemIdSlot in userInventoryObj) {
                if (userInventoryObj[itemIdSlot] === inventoryChanges.itemId) {
                    userInventoryObj[itemIdSlot] = null;
                    itemChanged.qty += 1;
                }
                if (itemChanged.qty === inventoryChanges.qty) break;
            }
        }
    }
}

async function marketOperationService(userInventoryObj, inventoryChanges, itemChanged, currencyChanged) {
    const marketStore = { itemId: 1, price: 1, qty: 10 };
    const userCurrency = await findUserCurrency();
    currencyChanged.totalValor = 0;
    currencyChanged.state = true;
    if (inventoryChanges.operation === 'add') {
        if (inventoryChanges.qty > 0 && userCurrency > 0) {
            for (const itemIdSlot in userInventoryObj) {
                if (userInventoryObj[itemIdSlot] === null) {
                    if (currencyChanged.totalValor >= userCurrency) {
                        break;
                    }
                    userInventoryObj[itemIdSlot] = inventoryChanges.itemId;
                    itemChanged.qty += 1;
                    currencyChanged.totalValor += marketStore.price;
                }
                if (itemChanged.qty === inventoryChanges.qty) break;
            }
        }
        console.log(currencyChanged);
        console.log(userCurrency);
    } else if (inventoryChanges.operation === 'remove') {
        if (inventoryChanges.qty > 0) {
            for (const itemIdSlot in userInventoryObj) {
                if (userInventoryObj[itemIdSlot] === inventoryChanges.itemId) {
                    userInventoryObj[itemIdSlot] = null;
                    itemChanged.qty += 1;
                    currencyChanged.totalValor += marketStore.price;
                }
                if (itemChanged.qty === inventoryChanges.qty) break;
            }
        }
        console.log(currencyChanged);
    }
}

module.exports = {
    getInventoryService,
    ChangeInventoryService
};
