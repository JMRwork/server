/* eslint-disable indent */
const db = require('../config/db.js');

/*  Refazer banco de dados do inventório.
    Remodelar modelo do inventário.
*/

async function findUserInventory(userId) {
    try {
        const userInventoryObj = await db.query('SELECT * FROM inventories WHERE user_id = $1', [userId]);
        let response;
        switch (userInventoryObj.rowCount) {
            case 1:
                response = { sucessful: true, error: null, userInventoryObj };
                return response;
            case 0:
                response = { sucessful: false, error: 'Error: Not Found. This user doesn\'t have an inventory associated to it.' };
                return response;
            default:
                response = { sucessful: false, error: 'Error: Conflict. Multiples inventories associated to same user' };
                return response;
        }
    } catch (e) {
        const response = { sucessful: false, error: e };
        return response;
    }
}

async function updateUserInventory(inventoryNewState, userId) {
    try {
        await db.query('UPDATE inventories SET itemid1 = $1, itemid2 = $2, itemid3 = $3, itemid4 = $4, itemid5 = $5, itemid6 = $6, itemid7 = $7, itemid8 = $8, itemid9 = $9, itemid10 = $10 WHERE user_id = $11', [...inventoryNewState, userId]);
        const response = { Sucessful: true, error: null };
        return response;
    } catch (e) {
        const response = { Sucessful: false, error: 'Internal Server Error' };
        return response;
    }
}

module.exports = {
    findUserInventory,
    updateUserInventory
};
