/* eslint-disable indent */
const { listItems, getItem, findUserItems, insertNewUserItems, removeUserItems } = require('../repository/items');
const { getInventoryCapService, getCurrencyService } = require('./status');

async function getItemsService() {
    const items = await listItems();
    if (items === null) {
        return { message: 'Error: Internal Server Error.' };
    }
    if (items.length === 0) {
        return { message: 'Error: General Items Data Not Found.' };
    }
    return items;
}

async function getInventoryService(userId) {
    const itemsResponse = await findUserItems(userId);
    const inventoryCapResponse = await getInventoryCapService(userId);
    if (!itemsResponse.error && !inventoryCapResponse.error) {
        const userInventoryArray = itemsResponse.map(item => item.item_id);
        console.log(userInventoryArray);
        const userEmptySpace = inventoryCapResponse.inventory_cap - userInventoryArray.length;
        for (let i = 0; i < userEmptySpace; i++) {
            userInventoryArray.push(null);
        }
        console.log(userInventoryArray);
        return { inventory: userInventoryArray, inventoryCap: inventoryCapResponse };
    }
    return itemsResponse.error ? { message: itemsResponse.error } : { message: inventoryCapResponse.error };
}

async function ChangeInventoryService(userId, inventoryChanges) {
    // Getting user changes and user items data on db
    // EX: inventoryChanges = { origin: 'actions', operation: 'remove', qty: 10, itemId: 1 };
    console.log(inventoryChanges);
    const itemChanged = { state: false, operation: inventoryChanges.operation, qty: 0, itemId: inventoryChanges.itemId };
    const currencyChanged = { state: false };

    const userInventory = await getInventoryService(userId);
    // Data structuring to accomplish changes
    console.log(userInventory);
    // Changing Data state
    // else if (inventoryChanges.operation === 'replace') {}
    // Commit to inventories table
    switch (inventoryChanges.origin) {
        case 'actions':
            actionsOperationService(userInventory.inventory, inventoryChanges, itemChanged);
            break;
        case 'market':
            await marketOperationService(userId, userInventory.inventory, inventoryChanges, itemChanged, currencyChanged);
            break;
        default:
            print('Error: Invalid origin.');
    };

    if (itemChanged.qty > 0) {
        itemChanged.state = true;
    }

    console.log(itemChanged);
    if (itemChanged.state) {
        const userDataUpdateResponse = await updateUserItems(itemChanged, currencyChanged, userId);
        if (!userDataUpdateResponse.Sucessful) {
            return { message: userDataUpdateResponse.error };
        }
        if (currencyChanged.state) {
            return { message: `${itemChanged.operation === 'add' ? 'buy' : 'sell'} of ${itemChanged.qty} items on inventory for ${currencyChanged.totalValue}¢ is sucessful.` };
        } else {
            return { message: `${itemChanged.operation} of ${itemChanged.qty} items on inventory is sucessful.` };
        }
    } else {
        if (itemChanged.operation === 'add' && userInventory.inventory.filter(item => item === null).length === 0) {
            return { message: 'Inventory full.' };
        } else if (itemChanged.operation === 'add' && currencyChanged.state) {
            return { message: 'Currency not enought.' };
        } else if (itemChanged.operation === 'remove' && userInventory.inventory.filter(item => item === inventoryChanges.itemId).length === 0) {
            return { message: 'There is none of this item in the inventory.' };
        } else {
            return { message: 'Inventory hasn\'t changed.' };
        }
    }
}

function actionsOperationService(userInventory, inventoryChanges, itemChanged) {
    if (inventoryChanges.operation === 'add') {
        if (inventoryChanges.qty > 0) {
            for (let i = 0; i < userInventory.length; i++) {
                console.log('aqui: ', userInventory[i]);
                if (userInventory[i] === null) {
                    userInventory[i] = inventoryChanges.itemId;
                    itemChanged.qty += 1;
                }
                if (itemChanged.qty === inventoryChanges.qty) break;
            };
        }
    } else if (inventoryChanges.operation === 'remove') {
        if (inventoryChanges.qty > 0) {
            for (let i = 0; i < userInventory.length; i++) {
                if (userInventory[i] === inventoryChanges.itemId) {
                    userInventory[i] = null;
                    itemChanged.qty += 1;
                }
                if (itemChanged.qty === inventoryChanges.qty) break;
            }
        }
    }
}

async function marketOperationService(userId, userInventory, inventoryChanges, itemChanged, currencyChanged) {
    const itemInfo = await getItem(inventoryChanges.itemId);
    if (itemInfo.error) {
        return { message: itemInfo.error };
    }
    const userCurrency = await getCurrencyService(userId);
    if (userCurrency.error) {
        return { message: userCurrency.error };
    }

    currencyChanged.state = true;
    currencyChanged.totalValue = 0;
    if (inventoryChanges.operation === 'add') {
        if (inventoryChanges.qty > 0 && userCurrency > 0) {
            for (let i = 0; i < userInventory.length; i++) {
                if (userInventory[i] === null) {
                    if (currencyChanged.totalValue >= userCurrency) {
                        break;
                    }
                    userInventory[i] = inventoryChanges.itemId;
                    itemChanged.qty += 1;
                    currencyChanged.totalValue += itemInfo.market_price;
                }
                if (itemChanged.qty === inventoryChanges.qty) break;
            }
        }
    } else if (inventoryChanges.operation === 'remove') {
        if (inventoryChanges.qty > 0) {
            for (let i = 0; i < userInventory.length; i++) {
                if (userInventory[i] === inventoryChanges.itemId) {
                    userInventory[i] = null;
                    itemChanged.qty += 1;
                    currencyChanged.totalValue += itemInfo.market_price;
                }
                if (itemChanged.qty === inventoryChanges.qty) break;
            }
        }
        console.log(currencyChanged);
    }
    if (currencyChanged.totalValue > 0) {
        currencyChanged.userCurrency = userCurrency;
    }
    console.log(currencyChanged);
}

async function updateUserItems(itemChanged, currencyChanged, userId) {
    if (itemChanged.operation === 'add') {
        return await insertNewUserItems(itemChanged, currencyChanged, userId);
    } else if (itemChanged.operation === 'remove') {
        return await removeUserItems(itemChanged, currencyChanged, userId);
    } else {
        return { Sucessful: false, error: 'Invalid operation.' };
    }
}

module.exports = {
    getItemsService,
    getInventoryService,
    ChangeInventoryService
};
