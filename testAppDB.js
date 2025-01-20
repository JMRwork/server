/* eslint-disable no-unused-vars */
const db = require('./config/db');

async function testInventoryUpdate(newInventory) {
    const response = await db.query('UPDATE inventories SET itemid1 = $1, itemid2 = $2, itemid3 = $3, itemid4 = $4, itemid5 = $5, itemid6 = $6, itemid7 = $7, itemid8 = $8, itemid9 = $9, itemid10 = $10 WHERE user_id = $11', [...newInventory, 1]);
    console.log(response);
}

async function testCreateUser(username, password) {
    const client = await db.connect();
    let response;
    try {
        await client.query('BEGIN');
        const resultUserCreate = await client.query('INSERT INTO users(username, password) VALUES ($1, $2) RETURNING id', [username, password]);
        await client.query('INSERT INTO users_status (user_id) VALUES ($1)', [resultUserCreate.rows[0].id]);
        await client.query('COMMIT');
        response = { message: 'User created successfully' };
    } catch (error) {
        console.error('Error creating user:', error);
        await client.query('ROLLBACK');
        response = { message: 'Internal Server Error' };
    } finally {
        await client.release();
        console.log(response);
        // eslint-disable-next-line no-unsafe-finally
        return response;
    }
}

async function testAddItems(items) {
    const client = await db.connect();
    let response;
    try {
        const client = await db.connect();
        await client.query('BEGIN');
        if (Array.isArray(items)) {
            for (const item of items) {
                await client.query('INSERT INTO items(name, description, market_price, market_qty) VALUES ($1, $2, $3, $4)', [item.name, item.description, item.market_price, item.market_qty]);
            }
        } else {
            await client.query('INSERT INTO items(name, description, market_price, market_qty) VALUES ($1, $2, $3, $4)', [items.name, items.description, items.market_price, items.market_qty]);
        }
        await client.query('COMMIT');
        response = { message: 'Items added successfully' };
    } catch (error) {
        console.error('Error adding items:', error);
        await client.query('ROLLBACK');
        response = { message: 'Internal Server Error' };
    } finally {
        await client.release();
        console.log(response);
    }
}

async function testAddActions(actions) {
    const client = await db.connect();
    let response;
    try {
        const client = await db.connect();
        await client.query('BEGIN');
        if (Array.isArray(actions)) {
            for (const action of actions) {
                await client.query('INSERT INTO actions(item_id, name) VALUES ($1, $2)', [action.item_id, action.name]);
            }
        } else {
            await client.query('INSERT INTO actions(item_id, name) VALUES ($1, $2)', [actions.item_id, actions.name]);
        }
        await client.query('COMMIT');
        response = { message: 'Actions added successfully' };
    } catch (error) {
        console.error('Error adding actions:', error);
        await client.query('ROLLBACK');
        response = { message: 'Internal Server Error' };
    } finally {
        await client.release();
        console.log(response);
    }
}

// testAddItems([{
//     name: 'Block of Wood',
//     description: 'A piece of wood that can be artfully transformed in construction materials, other objects or even combustible.',
//     market_price: 1,
//     market_qty: 100
// }, {
//     name: 'Food',
//     description: 'A joint of edibles consumables that is used to feed and maintain live ones.',
//     market_price: 1,
//     market_qty: 100
// }, {
//     name: 'Container of Water',
//     description: 'Water is used for multi-purpose activities. It\'s essencial in many processes, inclusive in maintain life.',
//     market_price: 1,
//     market_qty: 100
// }]);

testAddActions([
    {
        item_id: 1,
        name: 'Get Wood'
    },
    {
        item_id: 2,
        name: 'Farm food'
    },
    {
        item_id: 3,
        name: 'Get Water'
    }]);

// testCreateUser('test', 'test');
// testInventoryUpdate([1, 1, 1, 1, 2, 5, 5, 5, 5, 5]);
