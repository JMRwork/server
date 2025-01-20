const db = require('../config/db');

async function getActions() {
    try {
        const response = await db.query('SELECT * FROM actions');
        console.log(response.rows);
        return response.rows;
    } catch (e) {
        console.error('Error getting actions:', e);
        return { error: 'Internal Server Error' };
    }
}

async function findLocalActions(location) {
    try {
        const response = await db.query('SELECT * FROM local_actions WHERE local_id = $1', [location]);
        return response.rows;
    } catch (e) {
        console.error('Error getting local actions:', e);
        return { error: 'Internal Server Error' };
    }
};

module.exports = {
    getActions,
    findLocalActions
};
