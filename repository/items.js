/* eslint-disable indent */
const db = require('../config/db.js');

async function listItems() {
    try {
        const result = await db.query('SELECT * FROM items');
        return result.rows;
    } catch (e) {
        console.error('Error getting items:', e);
        return null;
    }
}

async function getItem(itemId) {
    try {
        const result = await db.query('SELECT * FROM items WHERE item_id = $1', [itemId]);
        let response;
        switch (result.rowCount) {
            case 0:
                response = { error: 'Item Data not Found.' };
                break;
            default:
                response = result.rows[0];
        }
        return response;
    } catch (e) {
        console.error('Error getting item:', e);
        const response = { error: 'Internal Server Error.' };
        return response;
    }
}

async function findUserItems(userId) {
    try {
        const result = await db.query('SELECT * FROM users_items WHERE user_id = $1', [userId]);
        console.log(result.rows);
        const response = result.rows;
        return response;
    } catch (e) {
        console.error('Error getting user items:', e);
        const response = { error: 'Internal Server Error.' };
        return response;
    }
}

// Currency change added there and in removeUserItems
async function insertNewUserItems(itemChanged, currencyChanged, userId) {
    try {
        const values = [];
        let sql = 'INSERT INTO users_items ( user_id, item_id ) VALUES ';
        for (let i = 0; i < itemChanged.qty; i++) {
            values.push(userId, itemChanged.itemId);
            sql += `($${i * 2 + 1}, $${i * 2 + 2}),`;
        }
        sql = sql.slice(0, -1);
        await db.query('BEGIN');
        await db.query(sql, [...values]);
        if (currencyChanged.state === true) {
            const newCurrency = currencyChanged.userCurrency - currencyChanged.totalValue;
            await db.query('UPDATE users_status SET currency = $1 WHERE user_id = $2', [newCurrency, userId]);
        }
        await db.query('COMMIT');
        const response = { Sucessful: true };
        return response;
    } catch (e) {
        console.error('Error on inserting items on user inventory:', e);
        await db.query('ROLLBACK');
        const response = { Sucessful: false, error: 'Internal Server Error' };
        return response;
    }
}

async function removeUserItems(itemChanged, currencyChanged, userId) {
    try {
        console.log(itemChanged, currencyChanged, userId);
        await db.query('BEGIN');
        await db.query('WITH items_to_delete AS (SELECT users_items.ctid FROM users_items WHERE user_id = $1 AND item_id = $2 LIMIT $3) DELETE FROM users_items USING items_to_delete WHERE users_items.ctid = items_to_delete.ctid', [userId, itemChanged.itemId, itemChanged.qty]);
        if (currencyChanged.state === true) {
            const newCurrency = currencyChanged.userCurrency + currencyChanged.totalValue;
            await db.query('UPDATE users_status SET currency = $1 WHERE user_id = $2', [newCurrency, userId]);
        }
        await db.query('COMMIT');
        const response = { Sucessful: true };
        return response;
    } catch (e) {
        console.error('Error on removing items from user inventory:', e);
        await db.query('ROLLBACK');
        const response = { Sucessful: false, error: 'Internal Server Error' };
        return response;
    }
}

module.exports = {
    listItems,
    getItem,
    findUserItems,
    insertNewUserItems,
    removeUserItems
};
