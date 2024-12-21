const db = require('./config/db');

async function testInventoryUpdate(newInventory) {
    const response = await db.query('UPDATE inventories SET itemid1 = $1, itemid2 = $2, itemid3 = $3, itemid4 = $4, itemid5 = $5, itemid6 = $6, itemid7 = $7, itemid8 = $8, itemid9 = $9, itemid10 = $10 WHERE user_id = $11', [...newInventory, 1]);
    console.log(response);
}

testInventoryUpdate([1, 1, 1, 1, 2, 5, 5, 5, 5, 5]);
